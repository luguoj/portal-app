<template>
  <section>
    <h1>This is sample-page</h1>
    <el-icon class="icon pi pi-book"></el-icon>
    <el-button @click="click">click</el-button>
    <el-input v-model="input"></el-input>
    <br>
  </section>
</template>

<script>
import {ModuleEntity} from "@/services/portal";
import {ref} from "vue";

export default {
  name: "SamplePage",
  components: {},
  setup() {
    return {
      input: ref(),
      click: () => {
        ModuleEntity.findAll()
      }
    }
  }
}
</script>

<style scoped>

</style>