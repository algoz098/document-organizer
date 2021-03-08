<script>
  import { onMount } from "svelte";
  import DriveFileForm from "./DriveFileForm.svelte";
  import { drive } from "../stores";
  export let item
  export let filter

  let internalItem = JSON.parse(JSON.stringify(item))

  const picTypes = [
    'image/png',
    'image/webp',
    'image/jpg',
  ]

  let editing = false
  let loading = false

  let hasImage = (picTypes.includes(item.mimeType) && item.thumbnailLink)

  async function checkDelete () {
    var r = confirm("Realmente deseja apagar o documento?");
    if(!r) return
    try {
      await gapi.client.drive.files.delete({
        fileId: item.id,
      })

      drive.removeFileById(internalItem)
    } catch (error) {
      console.error(error)
    }
  }

  async function updateItem() {
    loading = true
    try {
      await gapi.client.drive.files.update({
        fileId: item.id,
        name: internalItem.name,
        appProperties: internalItem.appProperties
      })

      editing = false

      drive.updateFileById(internalItem)
    } catch (error) {
      console.error(error)
    }
    loading = false
  }

  onMount(() => {
    if (!hasImage) {
      gapi.client.drive.files.get({
        fileId: item.id,
        fields: "id, name, mimeType, thumbnailLink, webViewLink, appProperties",
      }).then(function({result}) {
        drive.updateFileById(result)
        if (result.thumbnailLink) hasImage = true
      });
    }
  })
</script>

{#if
  !filter || (
    filter && (
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.appProperties.category.toLowerCase().includes(filter.toLowerCase())
    )
  )
}
  {#if !editing}
    <div>
      {#if hasImage}
      <figure style="width: 100%; overflow: hidden; margin: 0px; text-align: center; height: 120px;">
        <img referrerPolicy="no-referrer" alt={item.name} src="{item.thumbnailLink}" style="height: 120px; ">
      </figure>
      {/if}
      <p>
        <strong>Nome:</strong>
        {item.name}<br>
        <strong>Categoria:</strong>
        {item.appProperties.category || ''}<br>
        <strong>Tipo:</strong>
        {item.mimeType}<br>
        <button on:click={() => editing = true}>Editar</button>
        <a href={item.webViewLink} target="_blank">Ver</a>
        <button on:click={checkDelete}>Deletar</button>
      </p>
    </div>
  {:else}
    <div class="flex editing">
      <DriveFileForm
        cancel
        bind:item={internalItem}
        on:cancel={editing = false}
        on:done={updateItem}
      />
    </div>
  {/if}
{/if}

<style>
  .editing {
    min-width: 50em
  }
  div {
    width: calc(46em / 3);
    box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
    border-radius: 4px;
    padding: 16px
  }
</style>