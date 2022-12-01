import {Plugin, Store} from "vuex";
import deepmerge from "deepmerge";
import {PromiseQueue} from "@psr-framework/typescript-utils"

function load(key: string, storage: any) {
    const value = storage.getItem(key)
    try {
        return typeof value !== 'undefined' ? JSON.parse(value) : undefined
    } catch (err) {
        console.error('vuex.plugin.state-persist.load', err)
    }
    return undefined
}

function save(key: string, state: any, storage: any, queue: PromiseQueue.Queue) {
    queue.enqueue<any>((resolve: PromiseQueue.ResolveCallback<any>, reject: PromiseQueue.RejectCallback) => {
        try {
            storage.setItem(key, JSON.stringify(state))
            if (process.env.VUE_APP_LOG === 'debug') {
                console.log('vuex.plugin.state-persist.saved')
            }
            resolve(undefined)
        } catch (err) {
            console.error('vuex.plugin.state-persist.save', err)
            reject(err)
        }
    }).then()
}

export function createStatePersistPlugin(storage: any = localStorage, key = "vuex"): Plugin<any> {
    const queue: PromiseQueue.Queue = new PromiseQueue.Queue()
    return (store: Store<any>) => {
        const data = load(key, storage)
        if (data) {
            store.replaceState(deepmerge(store.state, data))
        }
        store.subscribe((mutation, state) => {
            save(key, state, storage, queue)
        })
        const originReplaceStateFn = Store.prototype.replaceState

        Store.prototype.replaceState = function replaceState(state) {
            save(key, state, storage, queue)
            originReplaceStateFn.apply(store,[state])
        };
    }
}