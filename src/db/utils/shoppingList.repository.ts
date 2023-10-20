import type { CreateShoppingListCommand } from '$lib/server/commands/create-list.command';
import type { AddItemToListCommand } from '$lib/server/commands/add-item.command';
import type { Document } from 'mongoose';
import { ShoppingListModel } from '$db/models/ShoppingList';
import { ItemModel } from '$db/models/Items';
import type { ShoppingListInterface, ItemInterface } from '../interfaces/db.interfaces';
import type { Id as IdType } from '$lib/server/domain/id.domain';
import type { ShoppingList as ShoppingListType } from '$lib/server/domain/shopping-list.domain';
import type { Item as ItemType } from '$lib/server/domain/item.domain';

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
    if(newShoppingList.name === '') {
        throw new Error('Shopping list name cannot be empty');
    }
    
    // check if the list of that name already exist, if yes show list already exist
    console.log(`Checking if list with name: ${newShoppingList.name} already exists`);
    let existingLists = await ShoppingListModel.find().lean();
    if (existingLists && existingLists.length !== 0) {
        existingLists = JSON.parse(JSON.stringify(existingLists));
        // console.log(existingLists);
        if(existingLists.filter((list) => list.name === newShoppingList.name).length !== 0) {
            throw new Error('List of that name already exist in saved shopping lists, Please provide a different name!');
        }
    }

    // save the list as new document in shoppingList collection
    const newListDoc = new ShoppingListModel(newShoppingList);
    const savedList = await newListDoc.save();
    return {
        id : { ...toDomainId(savedList) },
        listName: savedList.name,
    };
};

export const getSavedShoppingLists = async (): Promise<Array<ShoppingListType>> => {
    const savedLists = await ShoppingListModel
        .find()
        .lean()
        .populate('items');
        
    const listArray = savedLists.map((doc) => {
        return {
            id: doc._id.toString(),
            name: doc.name,
            isFinished: doc.isFinished,
            items: doc.items.map((itemDoc) => {
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
    const shoppingListMapped = findList.map((listDoc) => {
        return toShoppingListDomainFull(listDoc)
    });
    return shoppingListMapped[0];
};

// Items
export const addItemToList = async (newItemToAdd: AddItemToListCommand): Promise<IdType>  => {
    const { list, name } = newItemToAdd
    const foundList = await getShoppingListByName(list);
    if(!foundList) throw new Error(`List of name ${list} does not exist`);
    if(foundList.items.filter((item) => item.name == name ).length != 0) {
        throw new Error(`Item of name ${name} already exist`);
    }
    const newItemDoc = new ItemModel(newItemToAdd);
    const savedList = await newItemDoc.save();
    return toDomainId(savedList);
}