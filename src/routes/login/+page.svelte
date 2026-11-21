<script lang="ts">
  import { signIn, signOut } from "#lib/auth-client.js";
  import { page } from "$app/state";
  import { Heading, Button } from "flowbite-svelte";
  let authError = "";
  let pending = false;
  const logIn = async () => {
    pending = true;
    authError = "";
    try {
      await signIn();
    } catch {
      authError = "Unable to sign in. Please try again.";
    } finally {
      pending = false;
    }
  };
  const logOut = async () => {
    authError = "";
    try {
      await signOut();
    } catch {
      authError = "Unable to sign out. Please try again.";
    }
  };
</script>

<div class="ml-3">
  {#if authError || page.url.searchParams.has("error")}
    <p role="alert" class="my-3 text-red-700">{authError || "Sign-in could not be completed. Please try again."}</p>
  {/if}
  {#if page.data.session}
    {#if page.data.session.user?.image}
      <span
        style="background-image: url('{page.data.session.user.image}')"
        class="avatar"
      ></span>
    {/if}
    <div class="signedInText">
      <Heading tag="h6" class="ml-1 mb-3 mt-3"
        >Logged in as {page.data.session.user?.name ?? "User"}</Heading
      >
      <Button size="sm" href="/home" class="button">Create New List</Button>
      <Button size="sm" href="/lists" class="button">View Saved lists</Button>
      <Button size="sm" onclick={logOut} class="button">Sign out</Button>
    </div>
  {:else}
    <div class="notSignedInText">
      <Heading tag="h6" class="mt-3 mb-3 ml-1">
        You are currently not Signed In
      </Heading>
    </div>
    <Button class="ml-1" size="sm" onclick={logIn} disabled={pending}>{pending ? "Connecting..." : "Sign In to Continue"}</Button>
  {/if}
</div>
