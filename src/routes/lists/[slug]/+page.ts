/** @type {import('./$types').PageLoad} */
export function load({ params }: any) {
	if (params.slug && typeof params.slug === 'string') {
		return {
			slug: params.slug
		};
	}
}
