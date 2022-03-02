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
import {useStore} from "vuex";
import {computed} from "vue";
import {tokenService} from "@/services/Authorization";

export default {
  name: "DesktopHeaderUserPopover",
  emits: ['closePopover'],
  setup(props, context) {
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
          tokenService.signOut()
        })
        context.emit('closePopover')
      }
    }
  }
}
</script>

<style scoped>

</style>