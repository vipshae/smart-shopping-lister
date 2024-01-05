import { addItemToList, deleteItemFromList, getShoppingListByNameForUser, toggleItem, checkAllItemsCompletedInList, updateList } from '$db/utils/shoppingList.repository';
import { error, type Actions, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { AddItemToListCommand } from '$lib/server/commands/add-item.command';
import type { DeleteItemFromList } from '$lib/server/commands/delete-item.command';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { session } = await parent();
	if (!session?.user) throw redirect(303, '/login');
	const listNameToGet = params.listName;
	const listObj = await getShoppingListByNameForUser({
		name: listNameToGet,
		user: String(session.user.email)
	});
	if(!listObj) throw error(404, {
		message: `Shopping List ${listNameToGet} not found`,
		statusCode: 404,
		code: 'NOT_FOUND'
	});
	return {
		savedList: listObj,
		title: listObj.name
	};
};

export const actions: Actions = {
	toggleItemCompleted: async ({ request, url }) => {
		const id = url.searchParams.get('itemId') || '';
		const formData = await request.formData();
		const list = String(formData.get('listName'));
		const listId = String(formData.get('listId'));
		const name = String(formData.get('itemName'));
		try {
			const updatedItemResp = await toggleItem({id, name, list});
			const allItemsCompleted = await checkAllItemsCompletedInList(listId);
			if(allItemsCompleted === true) {
				const updatedList = await updateList(
					{ name: list, id: listId }, 
					{ isFinished: true }
				);
			} else {
				const updatedList = await updateList(
					{ name: list, id: listId }, 
					{ isFinished: false }
				);
			}
			return updatedItemResp;
		} catch(err: any) {
			console.error(err);
			return fail(err?.statusCode || 422, {
                error: err.message,
            });
		}
	},
	addItem: async ({ request }) => {
		const formData = await request.formData();
		const newItemName = String(formData.get('itemName'));
		const list = String(formData.get('listName'));
		const newItemToList: AddItemToListCommand = {
			name: newItemName,
			completed: false,
			list
		};
		try {
			await new Promise((fulfil) => setTimeout(fulfil, 500));
			const addedItemResp = await addItemToList(newItemToList);
			return addedItemResp;
		} catch(err: any) {
			return fail(err?.statusCode || 422, {
                error: err.message,
            });
		}
	},
	deleteItem: async ({ url, request }) => {
		const itemId = url.searchParams.get('itemId') || '';
		const formData = await request.formData();
		const listName = String(formData.get('listName'));
		const itemName = String(formData.get('itemName'));
		const deleteCommand: DeleteItemFromList = {
			id: itemId,
			name: itemName,
			list: listName
		}
		try {
			const deletedItemResp = await deleteItemFromList(deleteCommand);
			return deletedItemResp;
		} catch(err: any) {
			return fail(err?.statusCode || 422, {
                error: err.message,
            });
		}
	}
}