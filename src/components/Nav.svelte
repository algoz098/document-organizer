<script>
	import { drive } from '../stores'
	export let segment;

	function handleAuthClick () {
		gapi.auth2.getAuthInstance().signIn()
	}

	function handleSignoutClick () {
		gapi.auth2.getAuthInstance().signOut();
		drive.auth(false)
	}
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	button {
		position: relative;
		background: transparent;
		border: none;
		border-bottom: 2px solid rgb(255,62,0);
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
		{#if $drive.loading}
		<li>
			<button disabled>
				Carregando
			</button>
		</li>
		{:else if !$drive.auth}
		<li>
			<button on:click={handleAuthClick}>
				Autorizar GDrive
			</button>
		</li>
		{:else if $drive.auth}
		<li>
			<button on:click={handleSignoutClick}>
				Desautorizar GDrive
			</button>
		</li>
		{/if}
	</ul>
</nav>
