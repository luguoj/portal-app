// 未认证
import {reactive, ref, Ref, UnwrapNestedRefs, watch} from "vue";
import {PsrAppTokenService} from "./types/PsrAppTokenService";
import {PsrAppPlugin} from "@/libs/commons/psr/app-context";
import {createEventHook} from "@vueuse/core";
import {PsrAppTokenInfo, PsrAppTokenPrincipal} from "./types/PsrAppTokenInfo";
import {PsrAppTokenPrincipalChangeEvent} from "./types/PsrAppTokenEvent";

export class PsrAppToken<TS extends PsrAppTokenService> extends PsrAppPlugin {
    private readonly _principalChangeEvent = createEventHook<PsrAppTokenPrincipalChangeEvent>()
    readonly onPrincipalChange = this._principalChangeEvent.on
    // 令牌服务
    protected readonly _tokenService: TS;
    protected readonly _principal: Ref<PsrAppTokenPrincipal>
    // 令牌信息
    protected readonly _tokenInfo: UnwrapNestedRefs<PsrAppTokenInfo>;
    // 刷新令牌作业
    protected _flushing: Promise<UnwrapNestedRefs<PsrAppTokenInfo>> | null;

    constructor(injectKey: string, tokenService: TS) {
        super(injectKey)
        this._tokenService = tokenService
        this._principal = ref<PsrAppTokenPrincipal>({
            username: '',
            state: 'not_authenticated'
        })
        this._tokenInfo = reactive<PsrAppTokenInfo>({
            access_token: '',
            token_type: null,
            expires_at: null
        })
        watch(this._principal, (newState, oldState) => {
            this._principalChangeEvent.trigger({newState, oldState})
        })
        this._flushing = null
    }

    updatePrincipal(authentication: PsrAppTokenPrincipal) {
        this._principal.value = authentication
    }

    getPrincipal(): PsrAppTokenPrincipal {
        return {
            ...this._principal.value
        }
    }

    getTokenInfo() {
        return {
            ...this._tokenInfo
        }
    }

    tokenService() {
        return this._tokenService
    }

    // 判断令牌是否有效
    checkToken() {
        if (this._tokenInfo.access_token) {
            return !this._tokenInfo.expires_at || (this._tokenInfo.expires_at - new Date().getTime() > 0)
        }
        return false
    }

    // 获取请求头认证信息
    authorizationHeader() {
        return `${this._tokenInfo.token_type?.value} ${this._tokenInfo.access_token}`
    }

    // 刷新令牌信息
    refreshToken(init?: boolean) {
        console.error('refresh token')
        if (!this._flushing) {
            this._tokenInfo.expires_at = 1
            this.updatePrincipal({
                username: this._principal.value.username,
                state: 'synchronizing'
            })
            this._flushing = new Promise((resolve, reject) => {
                this._tokenService.getToken().then((data) => {
                    this._tokenInfo.token_type = data.token_type
                    this._tokenInfo.access_token = data.access_token
                    this._tokenInfo.expires_at = data.expires_at
                    this.updatePrincipal({
                        username: data.username,
                        state: 'authenticated'
                    })
                    resolve(this._tokenInfo)
                }).catch((err) => {
                    const currentUsername = this._principal.value.username
                    if (currentUsername && !init) {
                        this._tokenInfo.access_token = ''
                        this._tokenInfo.expires_at = null
                        this._tokenInfo.token_type = null
                        this.updatePrincipal({state: 'certification_expired', username: currentUsername})
                    } else {
                        this.updatePrincipal({state: 'not_authenticated', username: currentUsername})
                    }
                    reject(err)
                }).finally(() => this._flushing = null)
            })
            return this._flushing;
        }
        return this._flushing
    }

    signOut() {
        return this._tokenService.signOut().then(() => {
            this._tokenInfo.access_token = ''
            this._tokenInfo.expires_at = null
            this._tokenInfo.token_type = null
            this.updatePrincipal({
                username: '',
                state: 'not_authenticated'
            })
        })
    }
}

