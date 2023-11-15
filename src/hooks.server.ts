import { dbConnect, dbDisconnect } from "$lib/mongo";
import type { HandleServerError } from '@sveltejs/kit';

dbConnect();

// export const handleError: HandleServerError = ({ error, event }) => {
//     return {
//         message: `Server Error: ${error.message}`,
//         code: error?.code ?? 'UNKNOWN'
//     };
// };

