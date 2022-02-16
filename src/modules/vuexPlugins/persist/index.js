import {Queue} from "@/modules/promiseQueue";

export function createPersistedSatate(options = {}) {
    const storage = options.storage || localStorage
    const key = options.key || 'vuex'
    const queue = new Queue();

    function load(key, storage) {
        const value = storage.getItem(key)
        try {
            return typeof value !== 'undefined' ? JSON.parse(value) : undefined
        } catch (err) {
            console.error('vuex.plugin.persist.load', err)
        }
        return undefined
    }

    function save(key, state, storage) {
        queue.enqueue(() => {
            try {
                storage.setItem(key, JSON.stringify(state))
                if (process.env.VUE_APP_LOG === 'debug') {
                    console.log('vuex.plugin.persist.saved')
                }
            } catch (err) {
                console.error('vuex.plugin.persist.save', err)
            }
        })
    }

    return store => {
        const data = load(key, storage)
        store.clearPersistentData = () => {
            save(key, {}, storage)
        }
        if (data) {
            store.replaceState(data)
        }
        store.subscribe((mutation, state) => {
            save(key, state, storage)
        })
    }
}