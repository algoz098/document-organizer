<script>
import { onMount } from 'svelte';

	import Nav from '../components/Nav.svelte';

	import { initClient } from '../lib/drive'
	import { drive } from '../stores';

	export let segment;

	onMount(() => {
		drive.loading()
	})

	function handleClientLoad() {
		drive.loaded()
		gapi.load('client:auth2', initClient);
	}
</script>

<style>
	main {
		position: relative;
		max-width: 56em;
		background-color: white;
		padding: 2em;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>

<Nav {segment}/>

<svelte:head>
	<script async src="https://apis.google.com/js/api.js"
		on:load={handleClientLoad}
		on:readystatechange={e => console.log(e, e.readyState)}
	/>
</svelte:head>

<main>
	<slot></slot>
</main>