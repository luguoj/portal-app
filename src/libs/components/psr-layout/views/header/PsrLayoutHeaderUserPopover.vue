<template>
  <el-popover
      placement="bottom"
      :visible="visible"
  >
    <template #reference>
      <slot name="reference">
      </slot>
    </template>
    <div>
      <div>{{ username }}</div>
      <psr-el-async-action-button type="danger" :action="handleSignOut" style="width:100%">
        <template #icon>
          <el-icon class="pi pi-sign-out"/>
        </template>
        <span>退出系统</span>
      </psr-el-async-action-button>
    </div>
  </el-popover>
</template>

<script lang="ts">
import {ElMessageBox} from "element-plus";
import {useStore} from "vuex";
import {computed, defineComponent} from "vue";
import PsrElAsyncActionButton from "@/libs/components/psr-element-plus/buttons/PsrElAsyncActionButton.vue";
import {useTokenContext} from "@/libs/services/psr-oauth/context";

export default defineComponent({
  name: "psr-layout-header-user-popover",
  components: {
    PsrElAsyncActionButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible'],
  setup(props, context) {
    const store = useStore()
    const tokenContext = useTokenContext()
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