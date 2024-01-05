import { redirect, fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import type { CreateShoppingListCommand } from '$lib/server/commands/create-list.command';
import { createShoppingList } from '$db/utils/shoppingList.repository';

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent();
    return session;
};

export const actions: Actions = {
    createList: async ({ request }): Promise<any> => {
        try {
            await new Promise((fulfil) => setTimeout(fulfil, 1000));
            
            const formData = await request.formData();
            const shoppingListName = String(formData.get('shoppingListName'));
            const user = String(formData.get('user'));
                    
            console.log('Creating new shopping list: ', shoppingListName);
            const newShoppingList: CreateShoppingListCommand = {
                name: shoppingListName,
                isDone: false,
                user
            };

            const createdShoppingListResp = await createShoppingList(newShoppingList);
            return createdShoppingListResp;
        } catch(err: any) {
            return fail(422, {
                error: err.message,
            });
        }

    },

    addItems: async ({ url }) => {
        const shoppingListId = url.searchParams.get('shoppingListId');
        throw redirect(303, `/lists/${shoppingListId}`);
    }
}