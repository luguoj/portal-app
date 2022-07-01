<template>
  <el-form label-width="100px">
    <el-form-item label="邮箱地址">
      <el-input v-model="email" placeholder="username@domain.com"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "personal-center-emails",
  setup() {
    const phone = ref<string>();
    const email = ref<string>();
    return {
      phone,
      email
    }
  }
})
</script>

<style lang="scss" scoped>

</style>