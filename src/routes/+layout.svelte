<nav>
	<a href="/">Home</a>
	<a href="/lists">My Lists</a>
	<a href="/about">About</a>
</nav>

<slot />

<style>
	nav {
		background: rgb(193, 244, 195);
		position: relative;
		display: flex;
		gap: 1em;
		padding: 1em;
		z-index: 2;
		margin: 0 0 1em 0;
		border-radius: 2px;
	}
</style>
