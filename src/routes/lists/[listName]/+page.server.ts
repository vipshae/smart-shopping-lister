import { getShoppingListByName } from '$db/utils/shoppingList.repository';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const listNameToGet = params.listName;
	const listObj = await getShoppingListByName(listNameToGet);
	if(!listObj) throw error(404);
	return {
		savedList: listObj
	};
}) satisfies PageServerLoad;
