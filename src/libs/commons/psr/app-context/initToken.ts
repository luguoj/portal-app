import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED, SYNCHRONIZING} from "@/libs/commons/psr/app-context/plugins/token";
import {watch} from "vue";
import {ElMessage} from "element-plus/es";
import {initPermission} from "./initPermission";
import {PsrAppContext} from "./PsrAppContext";

const LOCAL_USER_NAME_KEY = 'psr-app-context-username'

function updateLocalUsername(username: string) {
    localStorage.setItem(LOCAL_USER_NAME_KEY, username)
}

function loadLocalUsername() {
    return localStorage.getItem(LOCAL_USER_NAME_KEY)
}

export function initToken(context: PsrAppContext) {
    const {token} = context
    const localUsername = loadLocalUsername()
    if (token !== undefined) {
        // 存在令牌上下文，认证用户信息，加载许可
        const msg: string[] = ['存在令牌上下文']
        // 初始化设置tokenInfo用户名为前一次访问的用户
        if (localUsername) {
            msg.push(`用本地用户(${localUsername})初始化`)
            token.tokenInfo().authentication = {
                username: localUsername,
                state: AUTHENTICATED
            }
        }
        msg.push('监听认证状态')
        console.log(msg.join('=>'))
        // 监听认证状态
        watch(() => token.tokenInfo().authentication.state, (state, oldState) => {
            onAuthenticationStateChange(context, state, oldState)
        }, {immediate: true})
    } else {
        console.log('不存在令牌上下文')
    }
}

function onAuthenticationStateChange(context: PsrAppContext, state: string, oldState?: string) {
    const token = context.token!
    const {router} = context
    const username = token.tokenInfo().authentication.username
    const localUsername = loadLocalUsername()
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
        if (localUsername) {
            console.log('用户:%s已登出', localUsername)
            ElMessage(`用户: ${localUsername} 已登出.`)
            context.routePathHangupBySignIn = '/'
            onUsernameChanged('', context)
        } else if (oldState === SYNCHRONIZING) {
            console.log('令牌刷新失败=>身份未认证=>重置store=>跳转登录', username)
            onUsernameChanged('', context, true)
        } else {
            console.log('匿名用户初始访问')
        }
    } else if (state === AUTHENTICATED) {
        const msg: string[] = []
        if (localUsername && username !== localUsername) {
            msg.push(`用户身份切换(${localUsername}=>${username})`, '重置store')
            ElMessage({
                message: `用户身份切换: ${localUsername} -> ${username}`,
                type: 'warning',
            })
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
            token.refreshToken(true)
        }
        console.log(msg.join('=>'))
    }
}

function onUsernameChanged(username: string, context: PsrAppContext, signIn?: boolean) {
    updateLocalUsername(username)
    initPermission(username, context).then(() => {
        context.store.loadUserProfile(username).finally(() => {
            if (signIn) {
                console.log('跳转登录')
                context.router.router.replace({name: 'sign-in'})
            } else if (context.routePathHangupBySignIn) {
                console.log('用户变更->跳转拦截的路由', context.routePathHangupBySignIn)
                context.router.router.replace({path: context.routePathHangupBySignIn})
            }
        })
    })
}