<template>
  <el-container style="height: 100%;" v-loading="loading||saving">
    <el-header class="fit">
      <design-header-bar
          :template-code="dashboardTemplateEntity.code"
          :dirty="dirtyData.flag"
          @refresh="handleRefresh"
          @save="handleSave"
      >
        <header-bar-tools-big-screen/>
      </design-header-bar>
    </el-header>
    <el-main style="padding: 0">
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import DesignHeaderBar from "../../components/design-header-bar.vue";
import {DashboardTemplateEntity} from "@/services/portal/types";
import HeaderBarToolsMasonry from "@/modules/admin-console/views/portal/dashboard/design/masonry/components/header-bar-tools-masonry.vue";
import HeaderBarToolsBigScreen from "@/modules/admin-console/views/portal/dashboard/design/big-screen/components/header-bar-tools-big-screen.vue";

export default defineComponent({
  name: "admin-console-portal-dashboard-design-big-screen",
  components: {
    HeaderBarToolsBigScreen,
    HeaderBarToolsMasonry,
    DesignHeaderBar
  },
  props: {
    dashboardTemplateId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const loading = ref(false)
    const saving = ref(false)
    const dashboardTemplateEntity = ref<DashboardTemplateEntity>({})
    const dirtyData = computed(() => {
      return {flag: true}
    })

    function handleRefresh() {

    }

    function handleSave() {

    }

    return {
      loading,
      saving,
      dashboardTemplateEntity,
      dirtyData,
      handleRefresh,
      handleSave
    }
  }
})
</script>

<style scoped>

</style>