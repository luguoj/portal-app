<template>
  <el-container>
    <el-header><h1>This is parent page.</h1></el-header>
    <router-link :to="{
      name: childRoute,
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
import {useAppContext} from "@/libs/commons/psr/app-context";

export default defineComponent({
  name: "SampleParentPage",
  setup() {
    const childRoute = useAppContext().router.computeModuleRouteName("sample-parent/sample-child")
    return {childRoute}
  }
})
</script>

<style scoped>

</style>