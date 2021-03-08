<script>
  import { createEventDispatcher } from "svelte";
  export let item
  export let img = null
  export let remove = false
  let dispatch = createEventDispatcher();
</script>

{#if img}
<div style="padding: 16px">
  <img src={img} alt={item?.file?.name} style="max-width: 320px; max-height: 210px">
</div>
{/if}

<div style="padding: 16px">
  {#if item.file}
  <div>
    <strong>Nome do arquivo:</strong> {item.file.name}<br>
  </div>

  <div>
    <strong>Tamanho:</strong> {item.file.size}
  </div>
  {/if}
  <div>
    <input type="text" bind:value={item.name} placeholder="Nome">
  </div>

  <div>
    <input type="text" bind:value={item.appProperties.category} placeholder="Categoria">
  </div>

  {#if remove}
  <button
    on:click={() => dispatch('remove')}
  >
    Remover
  </button>
  {/if}
  <button style="margin: 8px" on:click={() => dispatch('done')}>
    Pronto
  </button>
</div>

<style>
  button {
    font-size: 18px;
		background: transparent;
		border: 2px solid rgb(255,62,0);
		text-decoration: none;
		padding: 0.5em 0.75em;
  }

  input {
    font-size: 18px;
		border: 1px solid rgb(255,62,0);
    width: 300px;
    margin: 8px 0;
    padding: 8px;
  }
</style>