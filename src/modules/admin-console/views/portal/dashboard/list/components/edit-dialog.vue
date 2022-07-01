<template>
  <psr-create-update-form-dialog
      :model="model"
      @data-changed="$emit('dataChanged')"
  >
    <template #default="{formData,creating}">
      <el-form-item label="编码">
        <el-input v-model="formData.code"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description"/>
      </el-form-item>
      <el-form-item label="类型" :disabled="!creating">
        <dashboard-template-type-select v-model="formData.type"/>
      </el-form-item>
      <el-form-item label="激活">
        <el-switch v-model="formData.enabled"/>
      </el-form-item>
    </template>
  </psr-create-update-form-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {DashboardTemplateEntity} from "@/services/portal/types";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import PsrCreateUpdateFormDialog from "@/libs/components/psr/dialogs/create-update-form/index.vue";
import DashboardTemplateTypeSelect from "@/modules/admin-console/views/portal/dashboard/list/components/dashboard-template-type-select.vue";

export default defineComponent({
  name: "edit-dialog",
  components: {
    DashboardTemplateTypeSelect,
    PsrCreateUpdateFormDialog
  },
  props: {
    model: Object as PropType<PsrCreateUpdateFormDialogModel<DashboardTemplateEntity>>
  },
  emits: ['dataChanged']
})
</script>

<style scoped>
</style>