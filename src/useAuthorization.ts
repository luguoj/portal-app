import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/libs/services/psr-oauth/context";
import {watch} from "vue";
import {ElMessage} from "element-plus";
import {resetStore} from "@/store";
import {ROUTE_PATH_DESKTOP} from "@/libs/components/psr-layout/route";
import {useTokenContext} from "@/libs/services/psr-oauth/context";

function routeByAuthorization() {
    const router = useRouter()
    const store = useStore()
    const tokenContext = useTokenContext()
    const tokenInfo = tokenContext.tokenInfo()
    watch(() => router.currentRoute.value.fullPath, path => {
        // 防止用户手动跳转到登录页面
        if (path === ROUTE_PATH_DESKTOP.SIGN_IN) {
            if (tokenInfo.authentication.state === AUTHENTICATED) {
                router.replace({path: store.state.userLastRoutePath})
            }
        } else {
            store.commit('updateUserLastRoutePath', path)
        }
    })

    function goSignIn() {
        if (router.currentRoute.value.fullPath !== ROUTE_PATH_DESKTOP.SIGN_IN) {
            router.replace({path: ROUTE_PATH_DESKTOP.SIGN_IN})
        }
    }

    watch(() => tokenInfo.authentication.state, state => {
        console.log('routeByAuthorization',state)
        if (state === CERTIFICATION_EXPIRED) {
            console.log('身份认证过期, 请重新登录.', `用户: ${tokenInfo.authentication.username}`)
            ElMessage({
                message: '身份认证过期, 请重新登录.',
                type: 'warning',
            })
            goSignIn()
        } else if (state === NOT_AUTHENTICATED) {
            goSignIn()
        } else if (state === AUTHENTICATED) {
            router.isReady().then(() => router.replace({path: store.state.userLastRoutePath}))
        }
    })
}

function storeUsernameByAuthentication() {
    const store = useStore()
    const tokenContext = useTokenContext()
    const tokenInfo = tokenContext.tokenInfo()
    // 初始化设置tokenInfo用户名为前一次访问的用户
    if (store.state.username) {
        tokenInfo.authentication = {
            username: store.state.username,
            state: AUTHENTICATED
        }
    }
    // 认证状态处理
    watch(() => tokenInfo.authentication.state, state => {
        console.log('storeUsernameByAuthentication',state)
        if (state === NOT_AUTHENTICATED) {
            if (store.state.username) {
                ElMessage('已登出.')
                console.log('已登出', `用户: ${store.state.username}`)
            }
            resetStore()
        } else if (state === AUTHENTICATED) {
            if (store.state.username && tokenInfo.authentication.username !== store.state.username) {
                console.log('用户身份切换.', `用户: ${store.state.username} -> ${tokenInfo.authentication.username}`)
                ElMessage({
                    message: '用户身份切换.',
                    type: 'warning',
                })
                resetStore()
            } else {
                ElMessage({
                    message: '用户身份已认证.',
                    type: 'success',
                })
                console.log('用户身份已认证.', `用户: ${tokenInfo.authentication.username}`)
            }
            store.commit('signIn', tokenInfo.authentication.username)
        }
    })
    tokenContext.refreshToken()
}

export function useAuthorization() {
    storeUsernameByAuthentication()
    routeByAuthorization()
}