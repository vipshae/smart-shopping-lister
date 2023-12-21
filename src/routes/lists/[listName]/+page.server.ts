import { addItemToList, deleteItemFromList, getShoppingListByNameForUser, toggleItem } from '$db/utils/shoppingList.repository';
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
		user: String(session.user.name)
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
		const name = url.searchParams.get('itemId') || '';
		const formData = await request.formData();
		const list = String(formData.get('listName'));
		try {
			const updatedItemResp = await toggleItem({name, list});
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
		const itemName = url.searchParams.get('itemId') || '';
		const formData = await request.formData();
		const listName = String(formData.get('listName'));
		const deleteCommand: DeleteItemFromList = {
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