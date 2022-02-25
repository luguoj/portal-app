import {reactive} from "vue";
// 未认证
export const NOT_AUTHENTICATED = 'not_authenticated'
// 认证过期
export const CERTIFICATION_EXPIRED = 'certification_expired'
// 未认证
export const AUTHENTICATED = 'authenticated'

export function PSROAuthContext(tokenService) {
    // 令牌信息
    const tokenInfo = reactive({
        authenticateState: null,
        username: null,
        access_token: null,
        token_type: null,
        expires_at: null
    })
    this.tokenInfo = () => tokenInfo

    this.signOut = () => {
        tokenInfo.username = null
        tokenInfo.access_token = null
        tokenInfo.expires_at = null
        tokenInfo.token_type = null
        tokenInfo.authenticateState = NOT_AUTHENTICATED
    }

    // 判断令牌是否有效
    this.checkToken = () => {
        if (tokenInfo.access_token) {
            return !tokenInfo.expires_at || (tokenInfo.expires_at - new Date().getTime() > 0)
        }
        return false
    }
    // 获取请求头认证信息
    this.authorizationHeader = () => {
        return `${tokenInfo.token_type.value} ${tokenInfo.access_token}`
    }
    let flushing = null

    // 刷新令牌信息
    this.refreshToken = () => {
        if (!flushing) {
            tokenInfo.expires_at = 1
            flushing = new Promise((resolve, reject) => {
                tokenService.getToken().then((data) => {
                    tokenInfo.username = data.username
                    tokenInfo.token_type = data.token_type
                    tokenInfo.access_token = data.access_token
                    tokenInfo.expires_at = data.expires_at
                    tokenInfo.authenticateState = AUTHENTICATED
                    resolve()
                }).catch((err) => {
                    if (tokenInfo.username) {
                        tokenInfo.access_token = null
                        tokenInfo.expires_at = null
                        tokenInfo.token_type = null
                        tokenInfo.authenticateState = CERTIFICATION_EXPIRED
                    } else {
                        tokenInfo.authenticateState = NOT_AUTHENTICATED
                    }
                    reject(err)
                }).then(() => flushing = null)
            })
            return flushing;
        }
        return flushing
    }
}




