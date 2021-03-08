<script>
	import { drive } from '../stores'
	import { getFiles } from '../lib/drive'
	import debounce from '../lib/debounce'
	import DriveFile from '../components/DriveFile.svelte'
	import DriveUpload from '../components/DriveUpload.svelte'

	let loading = false
	let filter = ''
	let filterInternal = ''
	const search = debounce((filter) => {
		getFiles(filter)
	}, 300)

	async function createBasicStructure () {
		loading = true
		const fileMetadata = {
			'name': 'Document Organizer WebApp',
			'mimeType': 'application/vnd.google-apps.folder'
		};

		try {
			let {result} = await gapi.client.drive.files.create({
				resource: fileMetadata,
				fields: 'id'
			})

			drive.targetId(result.id)
		} catch (error) {
			console.error(err);
		}
		loading = false
	}
</script>

<style>
	h1, p {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		text-transform: uppercase;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>

<svelte:head>
	<title>Document Selector</title>
</svelte:head>

{#if !$drive.auth}
	<h1>Olá!, para usar, autorize o GDrive no topo</h1>
{:else if !$drive.targetId}
	<p>Você não tem a estrutura, deseja cria-la agora?</p>

	<p>
		O que isto fara?<br>
		Criarei uma pasta no começo do seu GDrive, com um nome especifico e tudo ficará lá dentro.
	</p>

	<div class="text-center">
		<button on:click={createBasicStructure} disabled={loading}>Criar estrutura</button>
	</div>

{:else}
	<DriveUpload bind:filter={filter} bind:filterInternal={filterInternal} on:filter={({detail}) => search(detail)}/>

	<div class="flex flex-wrap">
		{#await getFiles()}
			Carregando documentos...
		{:then value}
		{#each $drive.files.files as item}
		<DriveFile {item} filter={filterInternal} />
		{/each}
		{/await}
	</div>
{/if}

<pre>{JSON.stringify($drive.files, null, 2)}</pre>
