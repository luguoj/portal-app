// 未认证
import {reactive, UnwrapNestedRefs} from "vue";
import {PsrAppTokenService} from "./types/PsrAppTokenService";
import {PsrAppPlugin} from "@/libs/commons/psr/app-context";

export const NOT_AUTHENTICATED = 'not_authenticated'
// 认证过期
export const CERTIFICATION_EXPIRED = 'certification_expired'
// 未认证
export const AUTHENTICATED = 'authenticated'
// 同步中
export const SYNCHRONIZING = 'synchronizing'

interface TokenInfo {
    access_token: string;
    expires_at?: number | null;
    token_type: { value: string } | null;
    authentication: { state: string; username: string }
}

export class PsrAppToken<TS extends PsrAppTokenService> extends PsrAppPlugin {
    // 令牌服务
    protected readonly _tokenService: TS;
    // 令牌信息
    protected readonly _tokenInfo: UnwrapNestedRefs<TokenInfo>;
    // 刷新令牌作业
    protected _flushing: Promise<UnwrapNestedRefs<TokenInfo>> | null;

    constructor(injectKey: string, tokenService: TS) {
        super(injectKey)
        this._tokenService = tokenService
        this._tokenInfo = reactive({
            authentication: {
                username: '',
                state: NOT_AUTHENTICATED
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
            this._tokenInfo.authentication.state = SYNCHRONIZING
            this._flushing = new Promise((resolve, reject) => {
                this._tokenService.getToken().then((data) => {
                    this._tokenInfo.token_type = data.token_type
                    this._tokenInfo.access_token = data.access_token
                    this._tokenInfo.expires_at = data.expires_at
                    this._tokenInfo.authentication = {
                        username: data.username,
                        state: AUTHENTICATED
                    }
                    resolve(this._tokenInfo)
                }).catch((err) => {
                    if (this._tokenInfo.authentication.username && !init) {
                        this._tokenInfo.access_token = ''
                        this._tokenInfo.expires_at = null
                        this._tokenInfo.token_type = null
                        this._tokenInfo.authentication.state = CERTIFICATION_EXPIRED
                    } else {
                        this._tokenInfo.authentication.state = NOT_AUTHENTICATED
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
                state: NOT_AUTHENTICATED
            }
        })
    }
}

