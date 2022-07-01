<template>
  <el-form label-width="100px">
    <el-form-item label="手机号码">
      <el-input v-model="phone"/>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "personal-center-phone-number",
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