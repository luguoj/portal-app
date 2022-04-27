<template>
  <el-container class="ct-root" v-loading="dataTable.loading">
    <el-header class="fit">
      <view-part-header
          @find="dataTable.load(0)"
          @clear-filters="dataTable.clearFilters()"
          @add="editDialog.show()"
      />
    </el-header>
    <el-main class="ct-main">
      <view-part-table
          :model="dataTable"
          @edit="editDialog.show($event)"
          @data-changed="dataTable.load(0)"
      />
    </el-main>
  </el-container>
  <view-part-edit-dialog
      :model="editDialog"
      @data-changed="dataTable.load(0)"
  />
</template>

<script lang="ts">
import ViewPartEditDialog from "./ViewPartEditDialog.vue"
import {defineComponent} from "vue";
import ViewPartHeader from "./ViewPartHeader.vue";
import {createPsrElCreateUpdateFormDialogModel} from "@/libs/components/psr/element-plus/dialog/PsrElCreateUpdateFormDialogModel";
import {createPsrPFilterPagingDataTableModel} from "@/libs/components/psr/prime-vue/data-table/PsrPFilterPagingDataTableModel";
import {authorizationService} from "@/services/authorization";
import {FilterMatchMode} from "primevue/api";
import {UserEntity} from "@/services/authorization/CRUDService";
import ViewPartTable from "@/modules/admin-console/views/authorization/user/list/ViewPartTable.vue";

export default defineComponent({
  name: "admin-console-group-list",
  components: {
    ViewPartTable,
    ViewPartHeader,
    ViewPartEditDialog
  },
  setup() {
    const dataTable = createPsrPFilterPagingDataTableModel({
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
    const editDialog = createPsrElCreateUpdateFormDialogModel<UserEntity>({
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