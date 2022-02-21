<template>
  <div>
    <el-button type="danger" @click="onLogout" style="width:100%">
      <el-icon class="pi pi-sign-out"/>
      <span>退出系统</span>
    </el-button>
  </div>
</template>

<script>
import {inject} from "vue";
import {ElMessageBox} from "element-plus";

export default {
  name: "DesktopHeaderBarUserPopover",
  setup() {
    const logout = inject('logout')
    return {
      onLogout: () => {
        ElMessageBox.confirm(
            '确认登出当前用户?',
            '登出',
            {
              type: 'warning',
            }
        ).then(() => {
          logout()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>