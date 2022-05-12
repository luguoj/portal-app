<template>
  <el-select>
    <el-option
        v-for="dashboardType in dashboardTypes"
        :key="dashboardType.type"
        :value="dashboardType.type"
        :label="dashboardType.title"
    />
  </el-select>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import DashboardTemplateTypes from "@/services/portal/dictionary/DashboardTemplateTypes";

export default defineComponent({
  name: "dashboard-template-type-select",
  setup() {
    return {
      dashboardTypes: Array.from(DashboardTemplateTypes.values())
    }
  }
})
</script>

<style scoped>

</style>