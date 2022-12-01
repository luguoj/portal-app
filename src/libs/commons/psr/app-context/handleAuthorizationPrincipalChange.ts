import {ElMessage} from "element-plus/es";
import {PsrAppContext} from "@/libs/commons/psr/app-context";
import {initPermission} from "@/libs/commons/psr/app-context/initPermission";
import {PsrPlatformClientTypes} from "@psr-framework/vue3-plugin-platform-client";

export function handleAuthorizationPrincipalChange(
    context: PsrAppContext,
    newValue: PsrPlatformClientTypes.Principal,
    oldValue?: PsrPlatformClientTypes.Principal
) {
    const {router, platformClient} = context
    const state = newValue.state
    const oldState = oldValue?.state
    const oldUsername = oldValue?.username
    const username = newValue.username
    if (state === 'certification_expired') {
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
    } else if (state === 'not_authenticated') {
        if (oldUsername) {
            console.log('用户:%s已登出', oldUsername)
            ElMessage(`用户: ${oldUsername} 已登出.`)
            context.routePathHangupBySignIn = '/'
            onUsernameChanged('', context)
        } else if (oldState === "synchronizing") {
            console.log('令牌刷新失败=>身份未认证=>重置store=>跳转登录', username)
            onUsernameChanged('', context, true)
        } else {
            console.log('匿名用户初始访问')
        }
    } else if (state === "authenticated") {
        const msg: string[] = []
        if (oldUsername && username !== oldUsername) {
            msg.push(`用户身份切换(${oldUsername}=>${username})`, '重置store')
            ElMessage({
                message: `用户身份切换: ${oldUsername} -> ${username}`,
                type: 'warning',
            })
            context.routePathHangupBySignIn = '/'
            onUsernameChanged(username!, context)
        } else if (newValue.access_token) {
            msg.push(`用户身份认证${username}`)
            ElMessage({
                message: `用户身份已认证:${username}`,
                type: 'success',
            })
            onUsernameChanged(username!, context)
        } else {
            msg.push(`用户${username}刷新令牌`)
            platformClient!.authorizationContext.refreshToken().then()
        }
        console.log(msg.join('=>'))
    }
}

function onUsernameChanged(username: string, context: PsrAppContext, signIn?: boolean) {
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
        context.personal.changeUser(username)
    })
}