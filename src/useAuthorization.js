import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {tokenContext, tokenInfo} from "@/services/Authorization";
import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/modules/psr-oauth/context";
import {watch} from "vue";
import {ElMessage} from "element-plus";
import {resetStore} from "@/store";
import {ROUTE_PATH_DESKTOP} from "@/router/desktop";

function authentication() {
    const store = useStore()
    const router = useRouter()
    // 初始化设置tokenInfo用户名为前一次访问的用户
    if (store.state.username) {
        tokenInfo.authentication = {
            username: store.state.username,
            state: AUTHENTICATED
        }
    }
    let lastRoute = {path: ROUTE_PATH_DESKTOP.HOME}

    watch(() => router.currentRoute.value.fullPath, path => {
        // 防止用户手动跳转到登录页面
        if (path === ROUTE_PATH_DESKTOP.SIGN_IN) {
            if (tokenInfo.authentication.state === AUTHENTICATED) {
                router.replace(lastRoute)
            }
        } else {
            lastRoute = {path}
        }
    })

    function goSignIn() {
        if (router.currentRoute.value.fullPath !== ROUTE_PATH_DESKTOP.SIGN_IN) {
            router.replace({path: ROUTE_PATH_DESKTOP.SIGN_IN})
        }
    }

    // 认证状态处理
    watch(() => tokenInfo.authentication.state, state => {
        if (state === CERTIFICATION_EXPIRED) {
            console.log('身份认证过期, 请重新登录.', `用户: ${tokenInfo.authentication.username}`)
            ElMessage({
                message: '身份认证过期, 请重新登录.',
                type: 'warning',
            })
            goSignIn()
        } else if (state === NOT_AUTHENTICATED) {
            if (store.state.username) {
                ElMessage('已登出.')
                console.log('已登出', `用户: ${store.state.username}`)
            }
            resetStore()
            store.commit('signOut')
            goSignIn()
        } else if (state === AUTHENTICATED) {
            if (store.state.username && tokenInfo.authentication.username !== store.state.username) {
                console.log('用户身份切换.', `用户: ${store.state.username} -> ${tokenInfo.authentication.username}`)
                ElMessage({
                    message: '用户身份切换.',
                    type: 'warning',
                })
                resetStore()
                store.commit('signIn', tokenInfo.authentication.username)
                router.replace({path: ROUTE_PATH_DESKTOP.HOME})
            } else {
                ElMessage({
                    message: '用户身份已认证.',
                    type: 'success',
                })
                console.log('用户身份已认证.', `用户: ${tokenInfo.authentication.username}`)
                store.commit('signIn', tokenInfo.authentication.username)
                console.log(lastRoute.path)
                router.isReady().then(() => router.replace(lastRoute))
            }
        }
    })
    tokenContext.refreshToken()
}

export function useAuthorization() {
    authentication()
}