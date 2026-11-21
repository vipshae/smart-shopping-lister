import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  const session = await event.locals.auth();
  // Never serialize Better Auth's session token into page data.
  return {
    session: session
      ? {
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          },
          expires: session.session.expiresAt.toISOString(),
        }
      : null,
  };
};
