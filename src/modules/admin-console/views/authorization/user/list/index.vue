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
import HeaderBar from "./components/header-bar.vue";
import DataTable from "./components/data-table.vue";
import EditDialog from "./components/edit-dialog.vue"
import {defineComponent} from "vue";
import {authorizationService} from "@/services/authorization";
import {FilterMatchMode} from "primevue/api";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {PsrFilterPagingDataTableModel} from "@/libs/components/psr/widgets/data-table/filter-paging/PsrFilterPagingDataTableModel";
import {UserEntity} from "@/services/authorization/types";

export default defineComponent({
  name: "admin-console-authorization-user-list",
  components: {
    DataTable,
    HeaderBar,
    EditDialog
  },
  setup() {
    const dataTable = PsrFilterPagingDataTableModel.create<UserEntity>({
      loadDataHandler: (filter, pageable) => {
        return authorizationService.crud.user.findAll(filter, pageable)
      },
      defaultFilters: () => {
        return {
          'id': {value: null, matchMode: FilterMatchMode.CONTAINS},
          'enabled': {value: null, matchMode: FilterMatchMode.EQUALS}
        }
      }
    })
    const editDialog = PsrCreateUpdateFormDialogModel.create<UserEntity>({
      defaultData: () => {
        return {
          id: '',
          version: 0,
          enabled: false
        }
      },
      createHandler: (data: UserEntity) => {
        return authorizationService.crud.user.create({
          ...data
        })
      },
      updateHandler: (data: UserEntity) => {
        return authorizationService.crud.user.patch(
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