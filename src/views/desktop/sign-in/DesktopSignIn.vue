<template>
  <transition>
    <div class="psr-modal" v-show="notAuthorized">
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
import {computed, onBeforeMount, watchEffect} from "vue";
import {useStore} from "vuex";
import {ElMessageBox} from "element-plus";
import {tokenService} from "@/services/Authorization";
import {AUTHENTICATED, CERTIFICATION_EXPIRED, NOT_AUTHENTICATED} from "@/modules/psr-oauth/context";

export default {
  name: "DesktopSignIn",
  setup() {
    const store = useStore()

    const context = tokenService.context()
    const tokenInfo = context.tokenInfo()
    const notAuthorized = computed(() => {
      return tokenInfo.authenticateState === NOT_AUTHENTICATED
    })
    const signInFrame = tokenService.useSignInFrame()
    context.onUserChange((username, originUsername) => {
      ElMessageBox.alert(`用户: ${originUsername} -> ${username}`, '会话用户变更')
    })
    watchEffect(() => {
      if (tokenInfo.authenticateState === CERTIFICATION_EXPIRED) {
        ElMessageBox.alert('身份认证过期，请重新登录', 'Title', {
          callback: () => {
            tokenInfo.authenticateState = NOT_AUTHENTICATED
          }
        })
      } else if (tokenInfo.authenticateState === NOT_AUTHENTICATED) {
        store.commit('desktop/signOut')
      } else if (tokenInfo.authenticateState === AUTHENTICATED) {
        store.commit('desktop/signIn', tokenInfo.username)
      }
    })
    onBeforeMount(() => {
      if (store.state.desktop.username) {
        tokenInfo.username = store.state.desktop.username
      }
    })
    return {
      signInFrame,
      notAuthorized
    }
  }
}
</script>

<style scoped>
</style>