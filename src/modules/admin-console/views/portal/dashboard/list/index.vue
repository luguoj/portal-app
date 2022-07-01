<template>
  <el-container v-loading="dataTable.loading" style="height:100%;">
    <el-header class="fit">
      <header-bar
          @find="dataTable.load(0)"
          @clear-filters="dataTable.clearFilters()"
          @add="editDialog.show()"
      />
    </el-header>
    <el-main style="padding:0;">
      <data-table
          :model="dataTable"
          @edit="editDialog.show($event)"
          @data-changed="dataTable.load(0)"
      />
    </el-main>
  </el-container>
  <edit-dialog
      :model="editDialog"
      @data-changed="dataTable.load(0)"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import HeaderBar from "./components/header-bar.vue";
import EditDialog from "./components/edit-dialog.vue";
import DataTable from "./components/data-table.vue";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {NodeData} from "@/modules/admin-console/views/portal/dashboard/list/types";
import {createTableModel} from "@/modules/admin-console/views/portal/dashboard/list/services";
import {createDialogModel} from "@/modules/admin-console/views/portal/dashboard/list/services/createDialogModel";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {DashboardTemplateEntity} from "@/services/portal/types";

export default defineComponent({
  name: "admin-console-portal-dashboard-list",
  components: {
    HeaderBar,
    EditDialog,
    DataTable
  },
  setup() {
    const dataTable: PsrFilterTreeTableModel<NodeData> = createTableModel()
    const editDialog: PsrCreateUpdateFormDialogModel<DashboardTemplateEntity> = createDialogModel()
    return {
      dataTable,
      editDialog
    }
  }
})
</script>

<style scoped>

</style>