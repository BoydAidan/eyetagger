import imageService from '@/services/imageService'

const state = {
    annotations: {},
    canvas_image: undefined,
    images: [],
    sequential_counter: 0,
}

const getters = {
    annotation: (state, img_id) => {
        try {
            return state.annotations[img_id].annotation
        }
        catch(_) {
            return undefined
        }
    },
    annotations: state => {
        return state.annotations
    },
    canvas_image: state => {
        return state.canvas_image
    },
    images: state => {
        return state.images
    },
    sequential_counter: state => {
        return state.sequential_counter
    },
}

const actions = {
    getImages({ commit }) {
        imageService.fetchImages()
            .then(images => {
                commit('setImages', images)
            })
    },
    postAnnotations({ commit, state }) {

        const annotations = Object.values(state.annotations).filter(v => v.is_dirty)
        if (annotations.length > 0) {
            console.log("Updating " + annotations.length + " dirty annotations")
            imageService.postAnnotations(annotations)
                .then(response => {
                    commit('postAnnotations', response)
                })
        }

    },
    setAnnotation({ commit }, payload) {
        console.log("Setting new annotation locally")
        commit('setAnnotation', payload)
    },
    incSeqCounter({ commit }) {
        commit('incSeqCounter')
    },
    decSeqCounter({ commit }) {
        commit('decSeqCounter')
    },
    setSeqCounter({ commit }, new_val) {
        commit('setSeqCounter', new_val)
    },
    setCanvasImage({ commit }, new_val) {
        commit('setCanvasImage', new_val)
    },
}

const mutations = {
    setImages(state, images) {
        state.images = images
    },
    postAnnotations(state, response) {
        console.log(response)
        // TODO: lock canvas between submission and this response,
        //      to avoid losing new changes on slower networks
        response.successes.map(img => {
            console.log("Not dirty: " + img)
            state.annotations[img].is_dirty = false
        })
    },
    setAnnotation(state, payload) {
        // console.log(payload.img_id, payload.annotation)
        const id = payload.img_id
        if (state.annotations[id] === undefined) {
            state.annotations[id] = {}
        }
        state.annotations[id].img_id = id           // makes things simpler later
        state.annotations[id].is_dirty = true       // marks to be posted
        state.annotations[id].annotation = payload.annotation
        console.log(Object.keys(state.annotations).length);

    },
    incSeqCounter(state) {
        state.sequential_counter++
    },
    decSeqCounter(state) {
        state.sequential_counter--
    },
    setSeqCounter(state, new_val) {
        state.sequential_counter = new_val
    },
    setCanvasImage(state, new_val) {
        if (new_val == undefined) {
            console.log("WARN :: Trying to set canvas_image with no value.")
            return
        }
        console.log("Updated canvas image: " + new_val.img_path)
        state.canvas_image = new_val
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
