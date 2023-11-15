<script lang="ts">
  import "../app.postcss";
  import { page } from "$app/stores";
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
  import logo from '$lib/images/smart-shopper-logo.svg';
  import Footer from "$lib/components/Footer.svelte";

  $: activeUrl = $page.url.pathname;
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
	<NavBrand href="/">
	  <img src={logo} class="mr-3 h-8 lg:h-10" alt="ShoppingLister Logo" />
	  <!-- <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Smart Shopper</span> -->
	  <span class="self-center whitespace-nowrap text-xl font-semibold text-gray-900 dark:text-white"> Smart Shopper </span>
	</NavBrand>
	<NavHamburger />
	<NavUl {activeUrl} {activeClass} {nonActiveClass}>
		<NavLi href="/">Home</NavLi>
		<NavLi href="/lists">My Shopping Lists</NavLi>
		<NavLi href="/about">About</NavLi>
	</NavUl>
</Navbar>

<slot />

<Footer/>

<style>

</style>
