import axios from "axios";
import {onBeforeMount, onBeforeUnmount, onMounted, ref, watchEffect} from "vue";
import {
    CERTIFICATION_EXPIRED,
    NOT_AUTHENTICATED,
    PSROAuthContext
} from "@/modules/psr-oauth/context";


export function PSROAuthSSOClientTokenService(baseURL) {
    const context = new PSROAuthContext(this)

    this.context = () => context

    // 授权客户端
    const authClient = axios.create({
        baseURL: baseURL,
        withCredentials: true
    })

    // 调用获取令牌信息接口
    this.getToken = () => {
        return new Promise((resolve, reject) => {
            authClient.get('/api/token')
                .then(response => {
                        resolve(response.data)
                    }
                ).catch(err => {
                    reject(err)
                }
            )
        })
    }

    // 登出
    this.signOut = () => {
        return new Promise((resolve, reject) => {
            authClient.get('/logout')
                .then(response => {
                    if (response.status === 200) {
                        context.signOut()
                        resolve()
                    }
                })
                .catch(err => {
                    reject(err)
                })
        })
    }

    // 使用登录框架
    this.useSignInFrame = () => {
        const signInFrame = ref()

        function onMessage(event) {
            if (event.data === 'login_success') {
                console.log('login message got')
                signInFrame.value.src = ''
                context.refreshToken()
            } else if (event.data === 'login_retry') {
                console.log('login retry message got', signInFrame.value)
                signInFrame.value.src = baseURL
            }
        }

        onBeforeMount(() => {
            window.addEventListener('message', onMessage, false);
        })
        onBeforeUnmount(() => {
            window.removeEventListener('message', onMessage)
        })

        onMounted(() => {
            watchEffect(() => {
                if (context.tokenInfo().authentication.state === NOT_AUTHENTICATED
                    || context.tokenInfo().authentication.state === CERTIFICATION_EXPIRED) {
                    signInFrame.value.src = baseURL
                }
            })
        })
        return signInFrame
    }


}



