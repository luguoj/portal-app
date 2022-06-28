<template>
  <el-select clearable>
    <el-option
        v-for="hierarchy in hierarchyItems"
        :key="hierarchy.id"
        :value="hierarchy.id"
        :label="hierarchy.description"
    />
  </el-select>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref, watch} from "vue";
import {OrganizationHierarchyEntity} from "@/services/organization/types";
import {organizationService} from "@/services/organization";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";

export default defineComponent({
  name: "organization-hierarchy-select",
  props: {
    organizationUseId: {
      type: String
    }
  },
  setup(props) {
    const hierarchyItems = ref<OrganizationHierarchyEntity[]>([])
    onMounted(() => {
      watch(() => props.organizationUseId, organizationUseId => {
        if (organizationUseId) {
          organizationService.crud.organizationHierarchy.findAll(
              new FilterOptionsBuilder()
                  .field('organizationUseId').iEqual(organizationUseId)
                  .then().get(),
          ).then(result => {
            hierarchyItems.value = result.content
          })
        } else {
          hierarchyItems.value = []
        }
      }, {immediate: true})
    })
    return {
      hierarchyItems
    }
  }
})
</script>

<style scoped>

</style>