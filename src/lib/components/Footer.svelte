<script>
  import {
    Footer,
    FooterLinkGroup,
    FooterLink,
    ImagePlaceholder,
    TextPlaceholder,
    Skeleton,
    FooterCopyright,
  } from "flowbite-svelte";
</script>

<Footer class="absolute bottom-0 left-0 z-20 w-full">
  <FooterCopyright href="/" by="VS™" year={2024} />
  <FooterLinkGroup
    ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0"
  >
    <FooterLink href="/about">About</FooterLink>
    <FooterLink href="/">Privacy Policy</FooterLink>
    <FooterLink href="/">Licensing</FooterLink>
    <FooterLink href="/">Contact</FooterLink>
  </FooterLinkGroup>
</Footer>
