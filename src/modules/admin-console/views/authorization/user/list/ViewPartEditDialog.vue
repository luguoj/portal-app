<template>
  <psr-el-create-update-form-dialog
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
  </psr-el-create-update-form-dialog>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {UserEntity} from "@/services/authorization/CRUDService";
import PsrElCreateUpdateFormDialog from "@/libs/components/psr/element-plus/dialog/PsrElCreateUpdateFormDialog.vue";
import {PsrElCreateUpdateFormDialogModel} from "@/libs/components/psr/element-plus/dialog/PsrElCreateUpdateFormDialogModel";

export default defineComponent({
  name: "ViewPartEditDialog",
  components: {PsrElCreateUpdateFormDialog},
  props: {
    model: Object as PropType<PsrElCreateUpdateFormDialogModel<UserEntity>>
  },
  emits: ['dataChanged']
})
</script>

<style scoped>

</style>