import {createStore, ModuleTree, Plugin, Store, StoreOptions} from "vuex";
import {PsrAppStoreRootState} from "./types/PsrAppStoreRootState";
import deepmerge from "deepmerge";
import {PsrAppUserProfileService} from "./types/PsrAppUserProfileService";
import {ref} from "vue";

export class PsrAppStore {
    private readonly _storeOptions: StoreOptions<PsrAppStoreRootState>
    readonly store: Store<PsrAppStoreRootState>
    private readonly _userProfileService: PsrAppUserProfileService
    readonly userProfileSynchronized = ref<boolean | null>(null)

    constructor(storeModules: ModuleTree<any>, userProfileService: PsrAppUserProfileService, storePlugins?: Plugin<any>[]) {
        this._storeOptions = buildStoreOptions(storeModules)
        this._userProfileService = userProfileService
        this.store = createStore({
            ...this._storeOptions,
            plugins: [
                ...storePlugins || []
            ]
        })
        setInterval(() => {
            if (this.userProfileSynchronized.value === true) {
                this.updateUserProfile()
            }
        }, 5000)
    }

    resetStore(data?: any) {
        let newState = createStore(this._storeOptions).state
        if (data) {
            newState = deepmerge(newState, data)
        }
        this.store.replaceState(newState)
        this.userProfileSynchronized.value = null
    }

    loadUserProfile() {
        console.log('加载用户档案')
        this.userProfileSynchronized.value = null
        return this._userProfileService.find().then(content => {
            debugger
            if (content) {
                if (content && content.username === this.store.state.username) {
                    this.resetStore(content)
                } else {
                    throw new Error(`用户档案解析失败:${content}`)
                }
            }
            this.userProfileSynchronized.value = true
        }).catch((err) => {
            this.userProfileSynchronized.value = false
            return Promise.reject(err)
        })
    }

    updateUserProfile() {
        this.userProfileSynchronized.value = null
        return this._userProfileService.update(this.store.state).then(success => {
            if (success) {
                this.userProfileSynchronized.value = true
            }
        }).catch(() => {
            this.userProfileSynchronized.value = false
        })
    }
}

function buildStoreOptions(storeModules: ModuleTree<any>): StoreOptions<PsrAppStoreRootState> {
    return {
        state() {
            return {
                username: ''
            }
        },
        getters: {},
        mutations: {
            updateUsername(state, username) {
                state.username = username
            }
        },
        actions: {},
        modules: storeModules
    }
}