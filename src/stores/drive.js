import { writable } from 'svelte/store';

const start = {
	loading: true,
	loaded: false,
	targetId: null,
	files: {files: []}, 
	auth: false
}

function createStore () {
	const { subscribe, update } = writable(start);
	let value = start
	subscribe(e => {
		value = e
	})

	return {
		subscribe,

		loaded: () => update(n => {
			n.loading = false
			n.loaded = true
			return n
		}),

		files: (val) => update(n => {
			n.files = val
			return n
		}),
		removeFileById: (val) => update(n => {
			n.files.files = n.files.files.filter(e => e.id !== val.id)
			return n
		}),

		updateFileById: (val) => update(n => {
			let index = n.files.files.findIndex(e => e.id === val.id)
			if (index < 0) return n
			n.files.files[index] = val
			return n
		}),

		appendFile: (val) => update(n => {
			n.files.files.push(val)
			return n
		}),

		loading: () => update(n => {
			n.loading = true
			n.loaded = false
			return n
		}),

		auth: (val) => update(n => {
			n.auth = val
			return n
		}),

		getTargetId: () => value.targetId,

		targetId: (val) => update(n => {
			n.targetId = val
			return n
		}),
		
		reset: () => update(n => {
			n.loading = false
			n.loaded = false
			return n
		}),
	};
}

export default createStore