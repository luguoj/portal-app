<template>
  <el-select>
    <el-option
        v-for="use in useItems"
        :key="use.id"
        :value="use.id"
        :label="use.description"
    />
  </el-select>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from "vue";
import {OrganizationUseEntity} from "@/services/organization/types";
import {organizationService} from "@/services/organization";

export default defineComponent({
  name: "organization-use-select",
  setup() {
    const useItems = ref<OrganizationUseEntity[]>([])
    onMounted(() => {
      organizationService.crud.organizationUse.findAll().then(resulePage => {
        useItems.value = resulePage.content
      })
    })
    return {
      useItems
    }
  }
})
</script>

<style scoped>

</style>