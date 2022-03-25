<template>
  <el-container>
    <el-header><h1>This is parent page.</h1></el-header>
    <router-link :to="{
      name: 'sample-parent/sample-child',
      params:{
        pageNo:'asdb/asdff'
      }
    }">asdb/asdff
    </router-link>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "SampleParentPage",
})
</script>

<style scoped>

</style>