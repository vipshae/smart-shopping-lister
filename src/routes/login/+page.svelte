<script lang="ts">
    import { signIn, signOut } from '@auth/sveltekit/client';
    import { page } from "$app/stores";
    import { Heading, Button } from "flowbite-svelte";
    import type { PageData } from './$types';
    export let data: PageData;
    const logIn = () => {
        return signIn (
            'auth0', 
            {
                redirect: false,
                callbackUrl: data.SIGNIN_CALLBACKURL
            },
            {
                scope: 'api openid profile email'
            }
        )
    }
    const logOut = () => {
        return signOut({
            redirect: true,
            callbackUrl: data.SIGNOUT_CALLBACKURL
        })
    }
</script>

<p class="ml-3">
    {#if $page.data.session}
        {#if $page.data.session.user?.image}
            <span
            style="background-image: url('{$page.data.session.user.image}')"
            class="avatar"
            />
        {/if}
        <span class="signedInText">
            <Heading tag="h6" class="ml-1 mb-3 mt-3">Logged in as {$page.data.session.user?.name ?? "User"}</Heading>
            <Button size="sm" href="/home" class="button">Create New List</Button>
            <Button size="sm" href="/lists" class="button">View Saved lists</Button>
            <Button size="sm" on:click={logOut} class="button">Sign out</Button>
        </span>
    {:else}
        <span class="notSignedInText">
            <Heading tag="h6" class="mt-3 mb-3 ml-1">
                You are currently not Signed In
            </Heading>
        </span> 
      <Button class="ml-1" size="sm" on:click={logIn}>Sign In to Continue</Button>
    {/if}
</p>
