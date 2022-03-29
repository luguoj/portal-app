import {Store, useStore} from "vuex";
import {Router, useRouter} from "vue-router";
import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/libs/services/psr-oauth/context";
import {watch} from "vue";
import {ElMessage} from "element-plus";
import {resetStore} from "@/store";
import {ROUTE_SIGN_IN_PATH} from "@/libs/components/psr-oauth-sso-client-sign-in/route";
import {useTokenContext} from "@/libs/services/psr-oauth/context";
import {State} from "@/store/State";

function goSignIn(router: Router) {
    if (router.currentRoute.value.fullPath !== ROUTE_SIGN_IN_PATH) {
        router.replace({path: ROUTE_SIGN_IN_PATH})
    }
}

function onCertificationExpired(router: Router, username: string) {
    console.log('身份认证过期, 请重新登录.', `用户: ${username}`)
    ElMessage({
        message: `用户: ${username} 身份认证过期, 请重新登录.`,
        type: 'warning',
    })
    goSignIn(router)
}

function onNotAuthenticated(router: Router, username?: string) {
    if (username) {
        ElMessage(`用户: ${username} 已登出.`)
        console.log('已登出', `用户: ${username}`)
    }
    resetStore()
    goSignIn(router)
}

function onAuthenticated(store: Store<State>, router: Router, newUsername: string, oldUsername?: string) {
    if (oldUsername && newUsername !== oldUsername) {
        console.log('用户身份切换.', `用户: ${oldUsername} -> ${newUsername}`)
        ElMessage({
            message: `用户身份切换.: ${oldUsername} -> ${newUsername}`,
            type: 'warning',
        })
        resetStore()
    } else {
        ElMessage({
            message: `用户 ${newUsername} 身份已认证.`,
            type: 'success',
        })
        console.log('用户身份已认证.', `用户: ${newUsername}`)
    }
    store.commit('signIn', newUsername)
    router.isReady().then(() => router.replace({path: store.state.userLastRoutePath}))
}

export function handleAuthorization() {
    const store = useStore()
    const router = useRouter()
    const tokenContext = useTokenContext()
    const tokenInfo = tokenContext.tokenInfo()
    // 初始化设置tokenInfo用户名为前一次访问的用户
    if (store.state.username) {
        tokenInfo.authentication = {
            username: store.state.username,
            state: AUTHENTICATED
        }
    }

    // 禁止已经认证用户跳转到登录页面
    router.beforeEach(to => {
        if (to.path === ROUTE_SIGN_IN_PATH) {
            if (tokenInfo.authentication.state === AUTHENTICATED) {
                return false
            }
        }
        return true
    })
    // 成功跳转记录路径
    router.afterEach(to => {
        if (to.fullPath !== ROUTE_SIGN_IN_PATH) {
            store.commit('updateUserLastRoutePath', to.fullPath)
        }
    })

    // 监听认证状态
    watch(() => tokenInfo.authentication.state, state => {
        console.log('storeUsernameByAuthentication', state)
        if (state === CERTIFICATION_EXPIRED) {
            onCertificationExpired(router, tokenInfo.authentication.username)
        } else if (state === NOT_AUTHENTICATED) {
            onNotAuthenticated(router, store.state.username)
        } else if (state === AUTHENTICATED) {
            onAuthenticated(store, router, tokenInfo.authentication.username, store.state.username)
        }
    })
    tokenContext.refreshToken()
}