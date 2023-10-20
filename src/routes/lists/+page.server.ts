import type { PageServerLoad } from './$types';
import { getSavedShoppingLists } from '$db/utils/shoppingList.repository';
import type { Actions } from '@sveltejs/kit';

export const load: PageServerLoad = async() : Promise<any> => {
	const savedLists = await getSavedShoppingLists();
	const listsArray: any[] = []
	savedLists.forEach((listObj) => {
		const neededProps = { id: listObj.id, name: listObj.name, isFinished: listObj.isFinished }
		listsArray.push(neededProps)
	})
	return { listsArray };
}

export const actions: Actions = {
	deleteList: async ({ request }): Promise<any> => {

	}
}