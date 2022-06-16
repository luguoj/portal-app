// 使用登录框架
import {onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue";
import {useTokenContext} from "./PsrAppTokenProvider";
import {PsrAppTokenPrincipal} from "@/libs/commons/psr/app-context/plugins/token/types/PsrAppTokenInfo";

export function useSignInFrame() {
    const context = useTokenContext()
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

    function goSignIn(principal: PsrAppTokenPrincipal) {
        if (signInFrame.value != null
            && (principal.state === 'not_authenticated'
                || principal.state === 'certification_expired')) {
            signInFrame.value.src = context.tokenService().baseURL()
        }
    }

    onMounted(() => {
        goSignIn(context.getPrincipal())
        // 认证状态变为未认证或过期状态时，刷新登录页面重新认证
        context.onPrincipalChange(event => {
            goSignIn(event.newState)
        })
    })
    return signInFrame
}

