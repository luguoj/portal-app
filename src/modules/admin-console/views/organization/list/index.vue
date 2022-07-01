<template>
  <el-container v-loading="dataTable.loading" style="height:100%;">
    <el-header class="fit">
      <header-bar
          @find="dataTable.load()"
          @clear-filters="dataTable.clearFilters()"
          @add="editDialog.show()"
          v-model:organization-use-id="organizationUseId"
      />
    </el-header>
    <el-main style="padding:0;">
      <data-table
          :model="dataTable"
          @edit="editDialog.show($event)"
          @data-changed="dataTable.load()"
          selectionMode="single" v-model:selectionKeys="selectedIds"
          :organizationUseId="organizationUseId"
      />
    </el-main>
  </el-container>
  <edit-dialog
      :model="editDialog"
      :organizations="dataTable.records"
      @data-changed="dataTable.load()"
  />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import HeaderBar from "./components/header-bar.vue";
import DataTable from "./components/data-table.vue";
import EditDialog from "./components/edit-dialog.vue";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {createDialogModel, createTableModel} from "./services";
import {NodeData} from "./types";
import {OrganizationEntity} from "@/services/organization/types";

export default defineComponent({
  name: "admin-console-organization-list",
  components: {
    HeaderBar,
    DataTable,
    EditDialog
  },
  setup() {
    const organizationUseId = ref<string>()
    const selectedIds = ref<{ [key: string]: boolean }>()
    const parentId = computed<string | undefined>(() => {
      if (selectedIds.value !== undefined) {
        for (const valueKey in selectedIds.value) {
          if (selectedIds.value[valueKey]) {
            return valueKey
          }
        }
      }
      return undefined;
    })
    const dataTable: PsrFilterTreeTableModel<NodeData> = createTableModel(organizationUseId)
    const editDialog: PsrCreateUpdateFormDialogModel<OrganizationEntity> = createDialogModel(organizationUseId, parentId)
    onMounted(() => {
      watch(organizationUseId, () => {
        dataTable.load()
        dataTable.clearFilters()
      })
    })
    return {
      dataTable,
      editDialog,
      organizationUseId,
      selectedIds
    }
  }
})
</script>

<style lang="scss" scoped>

</style>