<template>
  <div>
    <div>{{ username }}</div>
    <el-button type="danger" @click="handleSignOut" style="width:100%">
      <el-icon class="pi pi-sign-out"/>
      <span>退出系统</span>
    </el-button>
  </div>
</template>

<script>
import {ElMessageBox} from "element-plus";
import {signOut} from "@/services/psrOAuthClient";
import {useStore} from "vuex";
import {computed} from "vue";

export default {
  name: "DesktopHeaderUserPopover",
  setup() {
    const store = useStore()
    return {
      username: computed(() => store.state.desktop.username),
      handleSignOut: () => {
        ElMessageBox.confirm(
            '确认登出当前用户?',
            '登出',
            {
              type: 'warning',
            }
        ).then(() => {
          signOut()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>