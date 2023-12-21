<script lang="ts">
    import hero from '$lib/images/smart-shopper-hero.png';
    import { Button } from 'flowbite-svelte';
    import { ArrowRightOutline } from 'flowbite-svelte-icons';
    import type { PageData } from './$types';
    export let data: PageData;
    $: userLogged = data?.session?.user || false;
    const getStartedRoute = userLogged ? '/home' : '/login'

</script>

<section class="bg-white dark:bg-gray-900">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">Smart Shopping Lister</h1>
            <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">Make most of your shopping needs with smart shopping list maker.</p>
            <Button size="lg" href={getStartedRoute}>
                Get Started <ArrowRightOutline class="w-3.5 h-3.5 ms-2" />
            </Button>
            <a href="/smart-assistance" class="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Try Smart shopping Assistant
            </a> 
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img src={hero} alt="mockup">
        </div>                
    </div>
</section>