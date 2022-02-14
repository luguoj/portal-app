import {createQueue} from "@/modules/promiseQueue";

export function createPersistedSatate(options = {}) {
    const storage = options.storage || localStorage
    const key = options.key || 'vuex'
    const queue = createQueue();

    function getState(key, storage) {
        const value = storage.getItem(key)
        try {
            return typeof value !== 'undefined' ? JSON.parse(value) : undefined
        } catch (err) {
            console.error(err)
        }
        return undefined
    }

    function setState(key, state, storage) {
        storage.setItem(key, JSON.stringify(state))
    }

    return store => {
        const data = getState(key, storage)
        if (data) {
            store.replaceState(data)
        }
        store.subscribe((mutation, state) => {
            queue.enqueue((reslove, reject) => {
                try {
                    setState(key, state, storage)
                    reslove()
                } catch (err) {
                    reject(err)
                }
            })
        })
    }
}