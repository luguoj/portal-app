<template>
  <el-container>
    <el-header><h1>This is parent page.</h1></el-header>
    <router-link :to="{
      name: `${layoutMeta?.name}/sample-parent/sample-child`,
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
import {useAppContext} from "psr-app-context/";

export default defineComponent({
  name: "SampleParentPage",
  setup() {
    const layoutMeta =  useAppContext().currentLayout.meta
    return {layoutMeta}
  }
})
</script>

<style scoped>

</style>