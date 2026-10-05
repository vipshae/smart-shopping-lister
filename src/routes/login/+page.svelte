<script lang="ts">
  import { signIn, signOut } from "@auth/sveltekit/client";
  import { page } from "$app/stores";
  import { Heading, Button } from "flowbite-svelte";
  const logIn = () => {
    return signIn(
      "auth0",
      {
        redirectTo: "/home",
      },
      {
        scope: "api openid profile email",
      }
    );
  };
  const logOut = () => {
    return signOut({
      redirect: true,
      redirectTo: "/",
    });
  };
</script>

<div class="ml-3">
  {#if $page.data.session}
    {#if $page.data.session.user?.image}
      <span
        style="background-image: url('{$page.data.session.user.image}')"
        class="avatar"
      ></span>
    {/if}
    <div class="signedInText">
      <Heading tag="h6" class="ml-1 mb-3 mt-3"
        >Logged in as {$page.data.session.user?.name ?? "User"}</Heading
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
    <Button class="ml-1" size="sm" onclick={logIn}>Sign In to Continue</Button>
  {/if}
</div>
