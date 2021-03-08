<script>
import axios from 'axios'
import { drive } from '../stores';
import DriveFileForm from './DriveFileForm.svelte';
import { createEventDispatcher } from "svelte";
let dispatch = createEventDispatcher();

export let filter
export let filterInternal

let inputFile
let file
let location
let uploadingIndex = 0
let uploading = false
let percentCompleted = 0
let data = []
let dataModel = {
  done: false,
  name: '',
  parents: [
    $drive.targetId
  ],
  appProperties: {
    category: ''
  }
}

const accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token

const url = "https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable"
const authHeaders = {
  Authorization: `Bearer ${accessToken}`,
}
const uploadConfig = {
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  onUploadProgress: function(progressEvent) {
    percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
  }
}

function generateImage (file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader()
    fileReader.onload = function(){
      resolve(fileReader.result)
    };
    fileReader.readAsDataURL(file);
  })
}

async function onChangeInput () {
  let files = inputFile.files

  for (const key in files) {
    if (Object.hasOwnProperty.call(files, key)) {
      const file = files[key];

      let imgSrc = await generateImage(file)

      data.push({
        file,
        imgSrc,
        ...dataModel,
        name: file.name,
      })
    }
  }
  data = data
}

async function sendFile (form, file) {
  try {
    let headers = {
      ...authHeaders
    }

    let result = await axios.post(url, form, {headers})
    location = result.headers.location

    result = await axios.put(location, file, uploadConfig)

    drive.appendFile(result.data)
  } catch (error) {
    console.error(error)
  }
}

async function submit (e) {
  uploading = true
  for (const [index, item] of data.entries()) {
    let file = item.file
    delete item.file
    
    delete item.done
    delete item.imgSrc
    uploadingIndex = index + 1
    await sendFile(item, file)
  }
  clear()
  uploading = false
}

function clear () {
  data = []
  file = null
  inputFile.value = null
}
</script>

<div class="card">
  <input
    type="file"
    multiple
    bind:this={inputFile}
    bind:value={file}
    on:change={onChangeInput}
    style="display: none"
  >
  {#if !file}
  <input type="text" bind:value={filter} on:keyup={() => dispatch('filter', filter)} placeholder="Busca" style="width: 120px">
  <input type="text" bind:value={filterInternal}  placeholder="Busca categorias">
  <button on:click={inputFile.click()}>Adicionar documentos</button>
  {:else if !uploading}
    {#each data as item, index}
    <div class="card flex" style="width: calc(100% - 32px)">
      {#if !item.done}
      <DriveFileForm
        remove
        img={item.imgSrc}
        bind:item={item}
        on:remove={e => data = data.filter((e, i) => i !== index)}
        on:done={e => item.done = true}
      />
      {:else}
        <strong>Nome do arquivo:</strong> {item.file.name}<br>

        <button style="margin: 8px" on:click={e => item.done = false}>
          Editar
        </button>
      {/if}
    </div>
    {/each}

  <button on:click={clear} >Limpar</button>
  <button on:click={submit} >Enviar</button>
  {:else}
  Enviando arquivo {uploadingIndex} em {percentCompleted}%
  {/if}
</div>

<style>
  div.card {
    box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
    border-radius: 4px;
    padding: 16px
  }

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