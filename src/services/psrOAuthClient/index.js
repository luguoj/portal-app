import axios from "axios";
import {EventEmitter} from "events"

// 授权客户端
const authClient = axios.create({
    baseURL: process.env.VUE_APP_PSR_AUTH_CLIENT_URL,
    withCredentials: true
})

// 调用获取令牌信息接口
function getTokenInfo() {
    return new Promise((resolve, reject) => {
        authClient.get('/api/token')
            .then(response => {
                    resolve(response.data)
                }
            ).catch(err => {
                reject(err)
            }
        )
    })
}

// 令牌信息
const tokenInfo = {
    username: undefined,
    access_token: undefined,
    token_type: undefined,
    expires_at: undefined
}

// 获取请求头认证信息
export function authorizationHeader() {
    return `${tokenInfo.token_type.value} ${tokenInfo.access_token}`
}

// 判断是否获得授权
export function authorized() {
    if (tokenInfo.access_token) {
        return !tokenInfo.expires_at || (tokenInfo.expires_at - new Date().getTime() > 0)
    }
    return false
}

let flushing = null

export const refreshTokenEvent = new EventEmitter()
export const REFRESH_TOKEN = 'refresh_token'
export const USER_CHANGED = 'user_changed'
export const NOT_AUTHENTICATED = 'not_authenticated'
export const CERTIFICATION_EXPIRED = 'certification_expired'

// 刷新令牌信息
export function refreshToken() {
    if (!flushing) {
        tokenInfo.expires_at = 1
        flushing = new Promise((resolve, reject) => {
            getTokenInfo().then((data) => {
                if (tokenInfo.username && tokenInfo.username != data.username) {
                    refreshTokenEvent.emit(USER_CHANGED)
                    reject(err)
                } else {
                    Object.assign(tokenInfo, data)
                    refreshTokenEvent.emit(REFRESH_TOKEN)
                    resolve()
                }
            }).catch((err) => {
                if (tokenInfo.access_token) {
                    refreshTokenEvent.emit(CERTIFICATION_EXPIRED)
                } else {
                    refreshTokenEvent.emit(NOT_AUTHENTICATED)
                }
                reject(err)
            }).then(() => flushing = null)
        })
        return flushing;
    }
    return flushing
}


// 登出
export function logout() {
    return new Promise((resolve, reject) => {
        authClient.get('/logout')
            .then(response => {
                if (response.status === 200) {
                    tokenInfo.access_token = undefined
                    tokenInfo.username = undefined
                    resolve()
                }
            })
            .catch(err => {
                reject(err)
            })
    })
}
