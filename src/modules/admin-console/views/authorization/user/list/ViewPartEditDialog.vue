<template>
  <psr-create-update-form-dialog
      :model="model"
      @data-changed="$emit('dataChanged')"
  >
    <template #default="{formData,creating}">
      <el-form-item label="用户名">
        <el-input v-model="formData.id" :disabled="!creating"/>
      </el-form-item>
      <el-form-item label="激活">
        <el-switch v-model="formData.enabled"/>
      </el-form-item>
    </template>
  </psr-create-update-form-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {UserEntity} from "@/services/authorization/CRUDService";
import PsrCreateUpdateFormDialog from "@/libs/components/psr/dialogs/PsrCreateUpdateFormDialog.vue";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/PsrCreateUpdateFormDialogModel";

export default defineComponent({
  name: "ViewPartEditDialog",
  components: {
    PsrCreateUpdateFormDialog
  },
  props: {
    model: Object as PropType<PsrCreateUpdateFormDialogModel<UserEntity>>
  },
  emits: ['dataChanged']
})
</script>

<style scoped>

</style>