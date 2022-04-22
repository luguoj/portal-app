import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/libs/commons/app-context/plugins/token";
import {watch} from "vue";
import {ElMessage} from "element-plus/es";
import {initPermission} from "./initPermission";
import {PsrAppContext} from "./PsrAppContext";

export function initToken(context: PsrAppContext) {
    const {token, store} = context
    if (token !== undefined) {
        // 存在令牌上下文，认证用户信息，加载许可
        const msg: string[] = ['存在令牌上下文']
        // 初始化设置tokenInfo用户名为前一次访问的用户
        if (store.store.state.username) {
            const cachedUsername = store.store.state.username
            msg.push(`用缓存的用户(${cachedUsername})初始化`)
            token.tokenInfo().authentication = {
                username: cachedUsername,
                state: AUTHENTICATED
            }
        }
        msg.push('监听认证状态')
        console.log(msg.join('=>'))
        // 监听认证状态
        watch(() => token.tokenInfo().authentication.state, state => {
            onAuthenticationStateChange(state, context)
        }, {immediate: true})
    } else {
        console.log('不存在令牌上下文')
    }
}

function onAuthenticationStateChange(state: string, context: PsrAppContext) {
    const token = context.token!
    const {store, router} = context
    const username = token.tokenInfo().authentication.username
    if (state === CERTIFICATION_EXPIRED) {
        console.log('用户:%s身份认证过期=>跳转登录', username)
        ElMessage({
            message: `用户: ${username} 身份认证过期, 请重新登录.`,
            type: 'warning',
        })
        router.router.isReady()
            .then(() => console.log('router ready fail'))
            .catch(() => console.log('router ready success'))
            .finally(() => {
                router.router.replace({name: 'sign-in'})
            })
    } else if (state === NOT_AUTHENTICATED) {
        if (username) {
            console.log('用户:%s已登出', username)
            ElMessage(`用户: ${username} 已登出.`)
        }
        console.log('身份未认证=>重置store=>跳转登录', username)
        store.resetStore()
        context.routePathHangupBySignIn = '/'
        onUsernameChanged('', context)
        router.router.isReady().finally(() => {
            router.router.push({name: 'sign-in'})
        })
    } else if (state === AUTHENTICATED) {
        const msg: string[] = []
        const oldUsername = store.store.state.username
        msg.push('更新store.username')
        store.store.commit('updateUsername', username)
        if (oldUsername && username !== oldUsername) {
            msg.push(`用户身份切换(${oldUsername}=>${username})`, '重置store')
            ElMessage({
                message: `用户身份切换: ${oldUsername} -> ${username}`,
                type: 'warning',
            })
            store.resetStore()
            context.routePathHangupBySignIn = '/'
            onUsernameChanged(username, context)
        } else if (token.tokenInfo().access_token) {
            msg.push(`用户身份认证${username}`)
            ElMessage({
                message: `用户身份已认证:${username}`,
                type: 'success',
            })
            onUsernameChanged(username, context)
        } else {
            msg.push(`用户${username}刷新令牌`)
            token.refreshToken().then(() => {
                onUsernameChanged(username, context)
            })
        }
        console.log(msg.join('=>'))
    }
}

function onUsernameChanged(username: string, context: PsrAppContext) {
    initPermission(username, context).then(()=>{
        console.log(context.routePathHangupBySignIn)
        if (context.routePathHangupBySignIn) {
            console.log('许可更新->跳转拦截的路由', context.routePathHangupBySignIn)
            context.router.router.replace({path: context.routePathHangupBySignIn})
        }
    })
}