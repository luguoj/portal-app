<template>
    <div>
      <div>{{ username }}</div>
      <el-divider style="margin:12px 0"/>
      <psr-async-action-button type="danger" :action="handleSignOut" style="width:100%">
        <template #icon>
          <el-icon class="pi pi-sign-out"/>
        </template>
        <span>退出系统</span>
      </psr-async-action-button>
    </div>
</template>

<script lang="ts">
import {ElMessageBox} from "element-plus";
import {useStore} from "vuex";
import {computed, defineComponent} from "vue";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/PsrAsyncActionButton.vue";
import {useAppContext} from "@/libs/commons/psr/app-context";

export default defineComponent({
  name: "psr-view-part-header-user-popover",
  components: {
    PsrAsyncActionButton
  },
  setup(props, context) {
    const store = useStore()
    const tokenContext = useAppContext().token!
    return {
      username: computed(() => store.state.username),
      handleSignOut: () => {
        return ElMessageBox.confirm(
            '确认登出当前用户?',
            '登出',
            {
              type: 'warning',
            }
        ).then(() => {
          tokenContext.signOut().finally(() =>
              context.emit('update:visible', false)
          )
        })
      }
    }
  }
})
</script>

<style scoped>

</style>