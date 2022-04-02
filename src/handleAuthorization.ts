import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/libs/services/psr-oauth/context";
import {watch} from "vue";
import {ElMessage} from "element-plus";
import {useTokenContext} from "@/libs/services/psr-oauth/context";
import {AppContext, useAppContext} from "psr-app-context/";

export const ROUTE_SIGN_IN_NAME = 'sign-in'

function goSignIn(appContext: AppContext) {
    if (appContext.router.currentRoute.value.name !== ROUTE_SIGN_IN_NAME) {
        appContext.router.replace({name: ROUTE_SIGN_IN_NAME})
    }
}

function onCertificationExpired(appContext: AppContext, username: string) {
    console.log('身份认证过期, 请重新登录.', `用户: ${username}`)
    ElMessage({
        message: `用户: ${username} 身份认证过期, 请重新登录.`,
        type: 'warning',
    })
    goSignIn(appContext)
}

function onNotAuthenticated(appContext: AppContext, username?: string) {
    if (username) {
        ElMessage(`用户: ${username} 已登出.`)
        console.log('已登出', `用户: ${username}`)
    }
    appContext.resetStore()
    goSignIn(appContext)
}

function onAuthenticated(appContext: AppContext, newUsername: string, oldUsername?: string) {
    if (oldUsername && newUsername !== oldUsername) {
        console.log('用户身份切换.', `用户: ${oldUsername} -> ${newUsername}`)
        ElMessage({
            message: `用户身份切换.: ${oldUsername} -> ${newUsername}`,
            type: 'warning',
        })
        appContext.resetStore()
    } else {
        ElMessage({
            message: `用户 ${newUsername} 身份已认证.`,
            type: 'success',
        })
        console.log('用户身份已认证.', `用户: ${newUsername}`)
    }
    appContext.store.commit('updateUsername', newUsername)
    appContext.router.isReady().then(() => appContext.router.replace({path: appContext.store.state.userLastRoutePath}))
}

export function handleAuthorization() {
    const tokenContext = useTokenContext()
    const tokenInfo = tokenContext.tokenInfo()
    const appContext = useAppContext()
    const store = appContext.store
    const router = appContext.router
    // 初始化设置tokenInfo用户名为前一次访问的用户
    if (store.state.username) {
        tokenInfo.authentication = {
            username: store.state.username,
            state: AUTHENTICATED
        }
    }

    // 禁止已经认证用户跳转到登录页面
    router.beforeEach(to => {
        if (to.name === ROUTE_SIGN_IN_NAME) {
            if (tokenInfo.authentication.state === AUTHENTICATED) {
                return false
            }
        }
        return true
    })
    // 成功跳转记录路径
    router.afterEach(to => {
        if (to.name !== ROUTE_SIGN_IN_NAME) {
            store.commit('updateUserLastRoutePath', to.fullPath)
        }
    })

    // 监听认证状态
    watch(() => tokenInfo.authentication.state, state => {
        console.log('storeUsernameByAuthentication', state)
        if (state === CERTIFICATION_EXPIRED) {
            onCertificationExpired(appContext, tokenInfo.authentication.username)
        } else if (state === NOT_AUTHENTICATED) {
            onNotAuthenticated(appContext, store.state.username)
        } else if (state === AUTHENTICATED) {
            onAuthenticated(appContext, tokenInfo.authentication.username, store.state.username)
        }
    })
    tokenContext.refreshToken()
}