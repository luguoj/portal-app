<template>
  <el-container class="ct-desktop">
    <el-main>
      <Workspace></Workspace>
      <SignIn v-if="!authorized" @signin="onSignIn"></SignIn>
      <el-button @click="onLogout">logout</el-button>
    </el-main>
  </el-container>
</template>

<script>
import {onMounted, ref} from "vue";
import Workspace from "@/views/desktop/Workspace";
import SignIn from "@/views/desktop/SignIn";
import {useStore} from "vuex";
import {
  CERTIFICATION_EXPIRED,
  NOT_AUTHENTICATED,
  refreshTokenEvent,
  logout,
  refreshToken,
} from "@/services/psrOAuthClient";
import {ElMessageBox} from "element-plus";

export default {
  name: "Desktop",
  components: {SignIn, Workspace},
  setup() {
    const store = useStore()
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
}
</script>

<style scoped>
.ct-desktop {
  height: 100%;
  width: 100%;
}
</style>