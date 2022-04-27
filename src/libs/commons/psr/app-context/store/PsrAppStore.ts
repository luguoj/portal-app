import {createStore, ModuleTree, Plugin, Store, StoreOptions} from "vuex";
import {PsrAppStoreRootState} from "./types/PsrAppStoreRootState";
import deepmerge from "deepmerge";
import {PsrAppUserProfileService} from "./types/PsrAppUserProfileService";
import {ref} from "vue";
import {ElMessageBox} from "element-plus";

export class PsrAppStore {
    private readonly _storeOptions: StoreOptions<PsrAppStoreRootState>
    readonly store: Store<PsrAppStoreRootState>
    private readonly _userProfileService?: PsrAppUserProfileService
    readonly userProfileSynchronized = ref<boolean | null>(null)

    constructor(storeModules: ModuleTree<any>, userProfileService?: PsrAppUserProfileService, storePlugins?: Plugin<any>[]) {
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
        window.onbeforeunload = () => {
            this.updateUserProfile()
        }
    }

    resetStore(data?: any) {
        let newState = createStore(this._storeOptions).state
        if (data) {
            newState = deepmerge(newState, data)
        }
        this.store.replaceState(newState)
        this.userProfileSynchronized.value = null
    }

    loadUserProfile(username: string): Promise<any> {
        console.log('加载用户档案')
        this.userProfileSynchronized.value = null
        if (this._userProfileService) {
            return this._userProfileService.find().then(content => {
                if (content && content.username === username) {
                    this.resetStore(content)
                    this.userProfileSynchronized.value = true
                } else {
                    return ElMessageBox.confirm(
                        '初始化用户档案?',
                        '同步用户档案异常',
                        {
                            confirmButtonText: '初始化',
                            cancelButtonText: '重新尝试同步',
                            type: 'warning',
                        }
                    ).then(() => {
                        this.resetStore({username: username})
                        this.userProfileSynchronized.value = true
                        return Promise.resolve()
                    }).catch(() => {
                        return this.loadUserProfile(username)
                    })
                }
                return Promise.resolve()
            }).catch((err) => {
                this.userProfileSynchronized.value = false
                return Promise.reject(err)
            })
        } else {
            this.resetStore({username: username})
            this.userProfileSynchronized.value = true
            return Promise.resolve()
        }
    }

    updateUserProfile() {
        this.userProfileSynchronized.value = null
        if (this._userProfileService) {
            return this._userProfileService.update(this.store.state).then(success => {
                if (success) {
                    this.userProfileSynchronized.value = true
                }
            }).catch(() => {
                this.userProfileSynchronized.value = false
            })
        } else {
            this.userProfileSynchronized.value = true
            return Promise.resolve()
        }
    }
}

function buildStoreOptions(storeModules: ModuleTree<any>): StoreOptions<PsrAppStoreRootState> {
    return {
        state() {
            return {
                username: '',
                defaultLayout: ''
            }
        },
        getters: {},
        mutations: {
            updateUsername(state, username) {
                state.username = username
            },
            updateDefaultLayout(state, layout) {
                state.defaultLayout = layout
            }
        },
        actions: {},
        modules: storeModules
    }
}