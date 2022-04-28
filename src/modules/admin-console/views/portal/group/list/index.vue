<template>
  <el-container class="ct-root" v-loading="dataTable.loading">
    <el-header class="fit">
      <header-bar
          @find="dataTable.load(0)"
          @clear-filters="dataTable.clearFilters()"
          @add="editDialog.show()"
      />
    </el-header>
    <el-main class="ct-main">
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
import EditDialog from "./components/edit-dialog.vue";
import {defineComponent} from "vue";
import {portalService} from "@/services/portal";
import {FilterMatchMode} from "primevue/api";
import HeaderBar from "@/modules/admin-console/views/portal/group/list/components/header-bar.vue";
import {GroupEntity} from "@/services/portal/types";
import DataTable from "@/modules/admin-console/views/portal/group/list/components/data-table.vue";
import {PsrFilterPagingDataTableModel} from "@/libs/components/psr/widgets/data-table/filter-paging/PsrFilterPagingDataTableModel";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";

if (typeof process.env.VUE_APP_PORTAL_ID !== 'string') {
  throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const portalId: string = process.env.VUE_APP_PORTAL_ID

export default defineComponent({
  name: "admin-console-portal-group-list",
  components: {
    HeaderBar,
    EditDialog,
    DataTable
  },
  setup() {
    const dataTable = PsrFilterPagingDataTableModel.create<GroupEntity>({
      loadDataHandler: (filter, pageable) => {
        return portalService.crud.group.findAll(filter, pageable)
      },
      defaultFilters: () => {
        return {
          'portalId': {value: process.env.VUE_APP_PORTAL_ID, matchMode: FilterMatchMode.EQUALS},
          'code': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'description': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'enabled': {value: null, matchMode: FilterMatchMode.EQUALS}
        }
      }
    })
    const editDialog = PsrCreateUpdateFormDialogModel.create<GroupEntity>({
      defaultData: () => {
        return {
          id: '',
          version: 0,
          code: '',
          description: '',
          enabled: false,
          portalId
        }
      },
      createHandler: (data: GroupEntity) => {
        return portalService.crud.group.create({
          ...data
        })
      },
      updateHandler: (data: GroupEntity) => {
        return portalService.crud.group.patch(
            ['enabled'],
            data
        )
      }
    })
    return {
      dataTable,
      editDialog
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-root {
  height: 100%;
}

.ct-main {
  padding: 0;
}
</style>