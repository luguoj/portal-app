<template>
  <el-container class="ct-desktop">
    <el-aside width="200px">
      <el-container>
        <el-header>title</el-header>
        <el-main>
          <NavigationMenu></NavigationMenu>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header>
        <HeaderBar></HeaderBar>
      </el-header>
      <el-main>
        <Workspace></Workspace>
      </el-main>
    </el-container>
  </el-container>
  <SignIn v-if="!authorized" @signin="onSignIn"></SignIn>
</template>

<script>
import Workspace from "@/views/desktop/Workspace";
import SignIn from "@/views/desktop/SignIn";
import {useStore} from "vuex";
import Authorize from "@/views/Authorize";
import NavigationMenu from "@/views/desktop/NavigationMenu";
import HeaderBar from "@/views/desktop/HeaderBar";

export default {
  name: "Desktop",
  components: {HeaderBar, NavigationMenu, SignIn, Workspace},
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