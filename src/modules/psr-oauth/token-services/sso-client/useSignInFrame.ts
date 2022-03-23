// 使用登录框架
import {onBeforeMount, onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import {CERTIFICATION_EXPIRED, NOT_AUTHENTICATED, PSROAuthContext} from "@/modules/psr-oauth/context";
import {PSROAuthSSOClientTokenService} from "@/modules/psr-oauth";

export function useSignInFrame(context: PSROAuthContext<PSROAuthSSOClientTokenService>) {
    const signInFrame = ref()

    function onMessage(event: any) {
        if (event.data === 'login_success') {
            console.log('login message got')
            signInFrame.value.src = ''
            context.refreshToken()
        } else if (event.data === 'login_retry') {
            console.log('login retry message got', signInFrame.value)
            signInFrame.value.src = context.tokenService().baseURL()
        }
    }

    onBeforeMount(() => {
        window.addEventListener('message', onMessage, false);
    })
    onBeforeUnmount(() => {
        window.removeEventListener('message', onMessage)
    })

    onMounted(() => {
        // 认证状态变为未认证或过期状态时，刷新登录页面重新认证
        watchEffect(() => {
            if (context.tokenInfo().authentication.state === NOT_AUTHENTICATED
                || context.tokenInfo().authentication.state === CERTIFICATION_EXPIRED) {
                signInFrame.value.src = context.tokenService().baseURL()
            }
        })
    })
    return signInFrame
}

