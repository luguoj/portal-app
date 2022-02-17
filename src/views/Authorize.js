import {onMounted, ref} from "vue"
import {
    CERTIFICATION_EXPIRED,
    logout,
    NOT_AUTHENTICATED,
    refreshToken,
    refreshTokenEvent
} from "@/services/psrOAuthClient";
import {ElMessageBox} from "element-plus";

export default function () {
    const authorized = ref(false)
    onMounted(() => {
        refreshTokenEvent.on(CERTIFICATION_EXPIRED, () => {
            ElMessageBox.alert('身份认证过期，请重新登录', 'Title', {
                callback: () => {
                    authorized.value = false
                },
            })
        })
        refreshTokenEvent.on(NOT_AUTHENTICATED, () => {
            authorized.value = false
        })
        onSignIn()
    })

    function onSignIn() {
        refreshToken().then(
            () => authorized.value = true
        )
    }

    function onLogout() {
        logout().then(() => {
            authorized.value = false
        })
    }

    return {
        authorized,
        onSignIn,
        onLogout
    }
}