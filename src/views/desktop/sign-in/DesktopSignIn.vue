<template>
  <transition>
    <div class="psr-modal" v-show="!authorized">
      <iframe
          ref="signInFrame"
          class="float"
          src=""
          frameborder=0
          width="100%"
          height="100%"
      />
    </div>
  </transition>
</template>

<script>
import {computed, onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue";
import {
  CERTIFICATION_EXPIRED,
  NOT_AUTHENTICATED,
  refreshToken,
  refreshTokenEvent, SIGN_OUT, signOut,
  tokenInfo, USER_CHANGED
} from "@/services/psrOAuthClient";
import {useStore} from "vuex";
import {ElMessageBox} from "element-plus";

export default {
  name: "DesktopSignIn",
  setup() {
    const store = useStore()
    const authorized = computed(() => {
      return store.state.desktop.username
    })
    const signInFrame = ref()

    function onSignIn() {
      refreshToken().then(
          () => {
            store.commit('desktop/signIn', tokenInfo.username)
          }
      )
    }

    function onSignOut() {
      store.commit('desktop/signOut')
      signInFrame.value.src = process.env.VUE_APP_PSR_AUTH_CLIENT_URL
    }

    function onMessage(event) {
      if (event.data === 'login_success') {
        console.log('login message got')
        onSignIn()
      } else if (event.data === 'login_retry') {
        console.log('login retry message got', signInFrame.value)
        signInFrame.value.src = process.env.VUE_APP_PSR_AUTH_CLIENT_URL
      }
    }

    onBeforeMount(() => {
      tokenInfo.username = store.state.desktop.username
    })
    onMounted(() => {
      refreshTokenEvent.on(USER_CHANGED, () => {
        ElMessageBox.alert('会话用户变更，请重新登录', 'Title', {
          callback: () => {
            signOut()
          }
        })
      })
      refreshTokenEvent.on(CERTIFICATION_EXPIRED, () => {
        ElMessageBox.alert('身份认证过期，请重新登录', 'Title', {
          callback: onSignOut
        })
      })
      refreshTokenEvent.on(NOT_AUTHENTICATED, onSignOut)
      refreshTokenEvent.on(SIGN_OUT, onSignOut)
      if (store.state.desktop.username) {
        onSignIn()
      } else {
        onSignOut()
      }
    })
    onBeforeMount(() => {
      window.addEventListener('message', onMessage, false);
    })
    onBeforeUnmount(() => {
      window.removeEventListener('message', onMessage)
    })
    return {
      signInFrame,
      authorized
    }
  }
}
</script>

<style scoped>
</style>