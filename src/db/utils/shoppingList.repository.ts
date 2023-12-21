import type { CreateShoppingListCommand } from '$lib/server/commands/create-list.command';
import type { AddItemToListCommand } from '$lib/server/commands/add-item.command';
import type { Document } from 'mongoose';
import mongoose from 'mongoose';
import { ShoppingListModel } from '$db/models/ShoppingList';
import { ItemModel } from '$db/models/Items';
import { ResourceAlreadyExistError, ResourceDoesNotExistError } from '$db/utils/errors';
import type { ShoppingListInterface, ItemInterface } from '../interfaces/db.interfaces';
import type { Id as IdType } from '$lib/server/domain/id.domain';
import type { ShoppingList as ShoppingListType } from '$lib/server/domain/shopping-list.domain';
import type { Item as ItemType } from '$lib/server/domain/item.domain';
import type { DeleteShoppingListCommand } from '$lib/server/commands/delete-list';
import type { DeleteItemFromList } from '$lib/server/commands/delete-item.command';

const toDomainId = (dbEntity: Document): IdType => {
    return {
        id: dbEntity._id.toString(),
    }
};

const toShoppingListDomainFull = (shoppingListEntity: ShoppingListInterface): ShoppingListType => {
    return {
        id: shoppingListEntity._id.toString(),
        name: shoppingListEntity.name,
        isFinished: shoppingListEntity.isFinished,
        items: shoppingListEntity.items.map((itemDoc: ItemInterface) => {
            return toItemDomainFull(itemDoc)
        })
    }
};

const toItemDomainFull = (itemEntity : ItemInterface): ItemType => {
    return {
        id: itemEntity._id.toString(),
        name: itemEntity.name,
        completed: itemEntity.completed,
        list: itemEntity.list
    }
};

// ShoppingLists
export const createShoppingList = async (newShoppingList: CreateShoppingListCommand) => {    
    const { name, isDone, user } = newShoppingList;
    // check if the list of that name for the user already exist, if yes show list already exist
    let existingLists = await ShoppingListModel.find({ name, user }).lean();
    if (existingLists && existingLists.length !== 0) {
        throw new ResourceAlreadyExistError({
            message: 'List of that name already exist in saved shopping lists, Please provide a different name!'
        });
    }

    // save the list as new document in shoppingList collection
    const newListDoc = new ShoppingListModel({name, isDone, user});
    const savedList = await newListDoc.save();
    return {
        id : { ...toDomainId(savedList) },
        listName: savedList.name,
    };
};

export const getSavedShoppingLists = async (user: String): Promise<Array<ShoppingListType>> => {
    const savedLists = await ShoppingListModel
        .find({ user })
        .lean()
        .populate('items');
        
    const listArray = savedLists.map((doc) => {
        return {
            id: doc._id.toString(),
            name: doc.name,
            isFinished: doc.isFinished,
            items: doc.items.map((itemDoc:any) => {
                return {
                    id: itemDoc._id.toString(),
                    name: itemDoc.name,
                    completed: itemDoc.completed,
                    list: itemDoc.list,
                };
            })
        };
    });
    return listArray;
};

export const getSavedShoppingListNames = async() : Promise<Array<string>> => {
    const savedLists = await ShoppingListModel.find().lean();
    const savedListNameArr = savedLists.map((listDoc) => {
        return listDoc.name;
    });
    return savedListNameArr;
};

export const getShoppingListByName = async(listName: string): Promise<ShoppingListType> => {
    const findList = await ShoppingListModel
        .find({name: listName})
        .populate('items');
    const shoppingListMapped = findList.map((listDoc:any) => {
        return toShoppingListDomainFull(listDoc)
    });
    return shoppingListMapped[0];
};

export const getShoppingListById = async(listId: string): Promise<ShoppingListType> => {
    const findList = await ShoppingListModel
        .find({_id: listId})
        .populate('items');
    const shoppingListMapped = findList.map((listDoc:any) => {
        return toShoppingListDomainFull(listDoc)
    });
    return shoppingListMapped[0];
}

export const deleteListById = async(listToDelete: DeleteShoppingListCommand): Promise<number> => {
    const shoppingListTobeDeleted = await getShoppingListById(listToDelete.id);
    shoppingListTobeDeleted.items.forEach(async (itemDoc) => {
        await ItemModel.findByIdAndDelete(new mongoose.Types.ObjectId(itemDoc.id))
    });
    const { deletedCount } = await ShoppingListModel.findByIdAndDelete(new mongoose.Types.ObjectId(listToDelete.id));
    return deletedCount;
}

export const updateList = async(filter = {}, updates = {}): Promise<String> => {
    await ShoppingListModel.updateOne(filter, updates);
    const updatedDoc = await ShoppingListModel.findOne(filter);
    if(!updatedDoc) {
        throw new ResourceDoesNotExistError({
            message: 'List not found and could not be updated'
        });
    }
    if('isFinished' in updates && updatedDoc.items) {
        await ItemModel.updateMany({}, {completed: updates.isFinished});
    }
    return updatedDoc.name;
}

// Items
export const addItemToList = async (newItemToAdd: AddItemToListCommand): Promise<IdType>  => {
    const { list, name } = newItemToAdd;
    const foundList = await ShoppingListModel.findOne({ name: list }).populate('items').exec();
    if (!foundList) {
        throw new ResourceDoesNotExistError({
            message: `List of name ${list} does not exist`
        });
    }
    // Check if existing item with same name already present
    if(foundList.items.filter((item: any) => item.name == name ).length != 0) {
        throw new ResourceAlreadyExistError({
            message: `Item of name ${name} already exist`
        });
    }
    const newItemDoc = new ItemModel(newItemToAdd);
    await newItemDoc.save();
    foundList.items.push(newItemDoc);
    await foundList.save();
    return toDomainId(newItemDoc);
}

export const deleteItemFromList = async (itemToDelete: DeleteItemFromList): Promise<IdType> => {
    const { name, list } = itemToDelete;
    console.log('item to delete::', name, list);
    const itemDocDeleted = await ItemModel.findOneAndDelete({ name, list });
    if(!itemDocDeleted) {
        throw new ResourceDoesNotExistError({
            message: `Item ${name} cannot be deleted as it doesn not exist`
        });
    }
    const foundList = await ShoppingListModel.findOne({ name: list }).populate('items').exec();
    if (!foundList) {
        throw new ResourceDoesNotExistError({
            message: `List of name ${list} does not exist`
        });
    }
    foundList.items.pull(itemDocDeleted._id);
    foundList.save();
    return toDomainId(itemDocDeleted);
}

export const updateItem = async(filter = {}, updates = {}): Promise<String> => {
    await ItemModel.updateOne(filter, updates);
    const updatedDoc = await ItemModel.findOne(filter);
    if(updatedDoc) {
        return updatedDoc.name;
    }
    throw new ResourceDoesNotExistError({
        message: 'Item not found and could not be updated'
    });
}

export const toggleItem = async (filter: any = {}) => {
    const { name } = filter;
    const currentItem = await ItemModel.findOne(filter);
    if(!currentItem) {
        console.log('does not exist');
        throw new ResourceDoesNotExistError({
            message: `Item of name ${name} does not exist`
        });
    }
    currentItem.completed = !currentItem.completed
    await currentItem.save();
    return toDomainId(currentItem);
}