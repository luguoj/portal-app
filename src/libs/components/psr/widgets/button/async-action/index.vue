<template>
  <el-button @click="onClick" :loading="loading" :disabled="disabled">
    <slot/>
    <template #icon v-if="$slots.icon">
      <slot name="icon"/>
    </template>
  </el-button>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";

export default defineComponent({
  name: "psr-async-action-button",
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