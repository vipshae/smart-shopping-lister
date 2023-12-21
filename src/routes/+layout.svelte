<script lang="ts">
	import "../app.postcss";
	import { page } from "$app/stores";
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Avatar, Dropdown, DropdownHeader, DropdownItem, DropdownDivider, Button } from 'flowbite-svelte';
	import logo from '$lib/images/smart-shopper-logo.svg';
	import Footer from "$lib/components/Footer.svelte";
	import type { LayoutData } from "./$types";
	import { signOut } from '@auth/sveltekit/client';

	$: activeUrl = $page.url.pathname;
	export let data: LayoutData;
	$: userLogged = data?.session?.user || false;
	const logoEndRoute = userLogged ? '/home' : '/'

	const logOut = () => {
        return signOut({
            redirect: true,
            callbackUrl: data.SIGNOUT_CALLBACKURL
        })
    }

	let activeClass = 'text-white bg-green-700 md:bg-transparent md:text-green-700 md:dark:text-white dark:bg-green-600 md:dark:bg-transparent';
	let nonActiveClass = 'text-gray-700 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-green-700 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent';
</script>

<svelte:head>
  <title
    >Smart Shopper App 📝 {$page.data.title
      ? ` - ${$page?.data.title}`
      : ""}</title
  >
</svelte:head>

<Navbar fluid={true}>
	<NavBrand href={logoEndRoute}>
	  <img src={logo} class="mr-3 h-8 lg:h-10" alt="ShoppingLister Logo" />
	  <!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Smart Shopper</span> -->
	  <span class="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white"> Smart Shopping Lister </span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl} {activeClass} {nonActiveClass}>
		{#if userLogged}
			<NavLi href="/home">Home</NavLi>
			<NavLi href="/lists">My Shopping Lists</NavLi>
			<NavLi>
				<Avatar id="user-drop" class="cursor-pointer mb-2" dot={{ placement: 'bottom-right', color: 'green' }} size="sm" />
				<Dropdown triggeredBy="#user-drop">
					<DropdownHeader>
						<span class="block truncate text-md font-medium">{data?.session?.user?.name}</span>
					</DropdownHeader>
					<DropdownItem>Settings</DropdownItem>
					<DropdownDivider />
  					<DropdownItem on:click={logOut}>Sign out</DropdownItem>
				</Dropdown>
			</NavLi>
		{:else}
			<NavLi href="/login">Login</NavLi>
		{/if}
		<NavLi href="/about">About</NavLi>

		
	</NavUl>
</Navbar>

<slot />

<Footer/>

<style>

</style>
