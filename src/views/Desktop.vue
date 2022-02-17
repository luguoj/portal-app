<template>
  <el-container class="ct-desktop">
    <el-main>
      <Workspace></Workspace>
      <el-button @click="onLogout">logout</el-button>
    </el-main>
  </el-container>
  <SignIn v-if="!authorized" @signin="onSignIn"></SignIn>
</template>

<script>
import Workspace from "@/views/desktop/Workspace";
import SignIn from "@/views/desktop/SignIn";
import {useStore} from "vuex";
import Authorize from "@/views/Authorize";

export default {
  name: "Desktop",
  components: {SignIn, Workspace},
  setup() {
    const store = useStore()
    const authorize = Authorize()

    return {
      ...authorize
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