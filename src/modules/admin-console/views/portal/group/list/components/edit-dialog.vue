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
      <el-form-item label="激活">
        <el-switch v-model="formData.enabled"/>
      </el-form-item>
    </template>
  </psr-create-update-form-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {GroupEntity} from "@/services/portal/types";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import PsrCreateUpdateFormDialog from "@/libs/components/psr/dialogs/create-update-form/index.vue";

export default defineComponent({
  name: "edit-dialog",
  components: {
    PsrCreateUpdateFormDialog
  },
  props: {
    model: Object as PropType<PsrCreateUpdateFormDialogModel<GroupEntity>>
  },
  emits: ['dataChanged']
})
</script>

<style scoped>
</style>