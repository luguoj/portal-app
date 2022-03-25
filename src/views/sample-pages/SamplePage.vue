<template>
  <section>
    <h1>This is sample-page</h1>
    <el-icon class="icon pi pi-book"></el-icon>
    <el-button @click="click">click</el-button>
    <el-input v-model="input"></el-input>
    <br>
  </section>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";

export default defineComponent({
  name: "SamplePage",
  components: {},
  setup() {
    return {
      input: ref(),
      click: () => {
      }
    }
  }
})
</script>

<style scoped>

</style>