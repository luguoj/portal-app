// 未认证
import {reactive, UnwrapNestedRefs} from "vue";
import {PsrAppTokenService} from "./types/PsrAppTokenService";
import {PsrAppPlugin} from "@/libs/commons/psr/app-context";
import {PsrAppTokenInfo} from "@/libs/commons/psr/app-context/plugins/token/types/PsrAppTokenInfo";

export class PsrAppToken<TS extends PsrAppTokenService> extends PsrAppPlugin {
    // 令牌服务
    protected readonly _tokenService: TS;
    // 令牌信息
    protected readonly _tokenInfo: UnwrapNestedRefs<PsrAppTokenInfo>;
    // 刷新令牌作业
    protected _flushing: Promise<UnwrapNestedRefs<PsrAppTokenInfo>> | null;

    constructor(injectKey: string, tokenService: TS) {
        super(injectKey)
        this._tokenService = tokenService
        this._tokenInfo = reactive({
            authentication: {
                username: '',
                state: 'not_authenticated'
            },
            access_token: '',
            token_type: null,
            expires_at: null
        })
        this._flushing = null
    }

    tokenInfo() {
        return this._tokenInfo
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
        if (!this._flushing) {
            this._tokenInfo.expires_at = 1
            this._tokenInfo.authentication.state = 'synchronizing'
            this._flushing = new Promise((resolve, reject) => {
                this._tokenService.getToken().then((data) => {
                    this._tokenInfo.token_type = data.token_type
                    this._tokenInfo.access_token = data.access_token
                    this._tokenInfo.expires_at = data.expires_at
                    this._tokenInfo.authentication = {
                        username: data.username,
                        state: 'authenticated'
                    }
                    resolve(this._tokenInfo)
                }).catch((err) => {
                    if (this._tokenInfo.authentication.username && !init) {
                        this._tokenInfo.access_token = ''
                        this._tokenInfo.expires_at = null
                        this._tokenInfo.token_type = null
                        this._tokenInfo.authentication.state = 'certification_expired'
                    } else {
                        this._tokenInfo.authentication.state = 'not_authenticated'
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
            this._tokenInfo.authentication = {
                username: '',
                state: 'not_authenticated'
            }
        })
    }
}

