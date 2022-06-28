<template>
  <psr-toolbar>
    <organization-use-select :model-value="organizationUseId" @change="$emit('update:organizationUseId',$event)"/>
    <el-button class="button" @click="$emit('find')">
      <template #icon>
        <el-icon class="pi pi-search"/>
      </template>
      查找
    </el-button>
    <el-button class="button" @click="$emit('clearFilters')">
      <template #icon>
        <el-icon class="pi pi-filter-slash"/>
      </template>
      重置
    </el-button>
    <el-button v-if="canAdd" class="button" @click="$emit('add')">
      <template #icon>
        <el-icon class="pi pi-plus"/>
      </template>
      添加
    </el-button>
  </psr-toolbar>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/base/index.vue";
import {usePermissionFlag} from "@/libs/commons/psr/app-context/usePermissionFlag";
import {ROUTE_ORGANIZATION_LIST} from "@/modules/admin-console/route";
import OrganizationUseSelect from "@/modules/admin-console/views/organization/list/components/organization-use-select.vue";
import OrganizationHierarchySelect from "@/modules/admin-console/views/organization/list/components/organization-hierarchy-select.vue";

export default defineComponent({
  name: "header-bar",
  components: {
    OrganizationHierarchySelect,
    OrganizationUseSelect,
    PsrToolbar
  },
  props: {
    organizationUseId: {
      type: String
    }
  },
  emits: ['add', 'find', 'clearFilters', 'update:organizationUseId'],
  setup() {
    const useId = ref<string>()
    const canAdd = usePermissionFlag('route', ROUTE_ORGANIZATION_LIST.name, ['add'])
    return {
      canAdd,
      useId
    }
  }
})
</script>

<style lang="scss" scoped>

</style>