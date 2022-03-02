<template>
  <h1>This is sample-page</h1>
  <el-icon class="icon pi pi-book"></el-icon>
  <el-button @click="click">click</el-button>
  <br>
</template>

<script>
import {ModuleEntity} from "@/services/portal";

export default {
  name: "SamplePage",
  components: {},
  setup() {
    return {
      click: () => {
        ModuleEntity.findAll()
      }
    }
  }
}
</script>

<style scoped>

</style>