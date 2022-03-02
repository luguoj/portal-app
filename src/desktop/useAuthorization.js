import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {tokenContext, tokenInfo} from "@/services/Authorization";
import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/modules/psr-oauth/context";
import {onMounted, watch} from "vue";
import {ElMessage} from "element-plus";
import {resetStore} from "@/store";
import {HOME, SIGN_IN} from "@/router/desktop";

function authentication() {
    const store = useStore()
    const router = useRouter()
    // 初始化设置tokenInfo用户名为前一次访问的用户
    if (store.state.desktop.username) {
        tokenInfo.authentication = {
            username: store.state.desktop.username,
            state: AUTHENTICATED
        }
    }
    let lastRoute = {path: HOME.path}

    watch(() => router.currentRoute.value.fullPath, path => {
        // 防止用户手动跳转到登录页面
        if (path === SIGN_IN.path) {
            if (tokenInfo.authentication.state === AUTHENTICATED) {
                router.replace(lastRoute)
            }
        } else {
            lastRoute = {path}
        }
    })

    function goSignIn() {
        if (router.currentRoute.value.fullPath !== SIGN_IN.path) {
            router.replace({path: SIGN_IN.path})
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
            if (store.state.desktop.username) {
                ElMessage('已登出.')
                console.log('已登出', `用户: ${store.state.desktop.username}`)
            }
            resetStore()
            store.commit('desktop/signOut')
            goSignIn()
        } else if (state === AUTHENTICATED) {
            if (store.state.desktop.username && tokenInfo.authentication.username !== store.state.desktop.username) {
                console.log('用户身份切换.', `用户: ${store.state.desktop.username} -> ${tokenInfo.authentication.username}`)
                ElMessage({
                    message: '用户身份切换.',
                    type: 'warning',
                })
                resetStore()
                store.commit('desktop/signIn', tokenInfo.authentication.username)
                router.replace({path: HOME.path})
            } else {
                ElMessage({
                    message: '用户身份已认证.',
                    type: 'success',
                })
                console.log('用户身份已认证.', `用户: ${tokenInfo.authentication.username}`)
                store.commit('desktop/signIn', tokenInfo.authentication.username)
                router.replace(lastRoute)
            }
        }
    })
    onMounted(() => {
        tokenContext.refreshToken()
    })
}

export function useAuthorization() {
    authentication()
}