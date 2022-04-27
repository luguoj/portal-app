<template>
  <el-dropdown-item @click="onClick" :disabled="disabled">
    <el-icon v-if="loading" class="is-loading">
      <icon-loading/>
    </el-icon>
    <template v-else>
      <slot name="icon"/>
    </template>
    <slot/>
  </el-dropdown-item>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import {Loading as IconLoading} from "@element-plus/icons-vue";

export default defineComponent({
  name: "PsrAsyncDropdownItem",
  components: {
    IconLoading
  },
  props: ['action', 'actionParams'],
  setup(props, context) {
    const synchronizing = ref(false)
    return {
      loading: computed(() => {
        return context.slots.icon && synchronizing.value
      }),
      disabled: synchronizing,
      onClick: () => {
        if (props.action) {
          if (synchronizing.value === false) {
            synchronizing.value = true
            const result = props.action(props.actionParams)
            if (result instanceof Promise) {
              result.finally(() => {
                synchronizing.value = false
              })
            } else {
              synchronizing.value = false
            }
          }
        }
      }
    }
  }
})
</script>

<style scoped>

</style>