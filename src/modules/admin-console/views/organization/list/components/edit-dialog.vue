<template>
  <psr-create-update-form-dialog
      :model="model"
      @data-changed="$emit('dataChanged')"
  >
    <template #default="{formData,creating}">
      <el-form-item label="上级组织">
        <el-tree-select
            v-model="formData.parentId"
            :data="parentOrganizations"
            value-key="id"
            :props="{children:'children',disabled:'disabled',label:'code'}"
            clearable
            check-strictly
        >
        </el-tree-select>
      </el-form-item>
      <el-form-item label="编码" required prop="code">
        <el-input v-model="formData.code"/>
      </el-form-item>
      <el-form-item label="描述" required prop="description">
        <el-input v-model="formData.description"/>
      </el-form-item>
      <el-form-item label="层级">
        <organization-hierarchy-select v-model="formData.hierarchyId" :organization-use-id="formData.useId"/>
      </el-form-item>
      <el-form-item label="激活">
        <el-switch v-model="formData.enabled"/>
      </el-form-item>
    </template>
  </psr-create-update-form-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import DashboardTemplateTypeSelect from "@/modules/admin-console/views/portal/dashboard/list/components/dashboard-template-type-select.vue";
import PsrCreateUpdateFormDialog from "@/libs/components/psr/dialogs/create-update-form/index.vue";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {OrganizationEntity} from "@/services/organization/types";
import OrganizationHierarchySelect from "@/modules/admin-console/views/organization/list/components/organization-hierarchy-select.vue";
import {NodeData} from "@/modules/admin-console/views/organization/list/types";
import {filterFromRoot} from "@/libs/commons/psr/utils/array-tree";

export default defineComponent({
  name: "edit-dialog",
  components: {
    DashboardTemplateTypeSelect,
    PsrCreateUpdateFormDialog,
    OrganizationHierarchySelect
  },
  props: {
    model: {
      type: Object as PropType<PsrCreateUpdateFormDialogModel<OrganizationEntity>>,
      required: true
    },
    organizations: {
      type: Object as PropType<NodeData[]>,
      required: true,
      default: []
    }
  },
  emits: ['dataChanged'],
  setup(props) {
    const parentOrganizations = computed(() => {
      return filterFromRoot(
          props.organizations,
          organization => {
            const parentOrganization = organization.organization
            const childOrganization = props.model.data
            if (childOrganization.id) {
              return parentOrganization.useId == childOrganization.useId
                  && (
                      parentOrganization.rootId != childOrganization.rootId
                      || parentOrganization.right! > childOrganization.right!
                      || parentOrganization.left! < childOrganization.left!
                  )
            } else {
              return true
            }
          }
      )
    })
    return {
      parentOrganizations
    }
  }
})
</script>

<style lang="scss" scoped>

</style>