<template>
  <psr-el-create-update-form-dialog
      :default-data="defaultData"
      :handle-create="handleCreate"
      :handle-update="handleUpdate"
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
import {defineComponent} from "vue";
import {UserEntity} from "@/services/authorization/CRUDService";
import {authorizationService} from "@/services/authorization";
import PsrElCreateUpdateFormDialog from "@/libs/components/psr/element-plus/dialog/PsrElCreateUpdateFormDialog.vue";

function defaultData(): UserEntity {
  return {
    id: '',
    version: 0,
    enabled: false
  }
}

export default defineComponent({
  name: "ViewPartEditDialog",
  components: {PsrElCreateUpdateFormDialog},
  setup() {
    function handleCreate(data: UserEntity) {
      return authorizationService.crud.user.create({
        ...data
      })
    }

    function handleUpdate(data: UserEntity) {
      return authorizationService.crud.user.patch(
          ['enabled'],
          data
      )
    }

    return {
      defaultData,
      handleCreate,
      handleUpdate
    }
  }
})
</script>

<style scoped>

</style>