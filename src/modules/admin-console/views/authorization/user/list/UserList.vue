<template>
  <el-container class="ct-root" v-loading="tableProps.loading">
    <el-header class="fit">
      <view-part-header
          @find="handleFind"
          @clear-filters="handleClearFilters"
          @add="handleAdd"
      />
    </el-header>
    <el-main class="ct-main">
      <p-data-table
          ref="tableRef"
          class="table p-datatable-sm"
          responsiveLayout="scroll"
          :scrollable="true"
          scrollHeight="flex"
          scrollDirection="both"
          :resizableColumns="true"
          columnResizeMode="expand"
          :paginator="true"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="{first} - {last} / {totalRecords}"
          :lazy="true"
          v-model:first="tableProps.pageable.offset"
          :rows="tableProps.pageable.limit"
          @page="onDataTableEvent($event)"
          @sort="onDataTableEvent($event)"
          :value="tableProps.data.content"
          :totalRecords="tableProps.data.totalElements"
          v-model:filters="tableProps.filters"
          filterDisplay="row"
      >
        <template #empty>
          没有数据.
        </template>
        <template #paginatorstart>
          <el-select v-model="tableProps.pageable.limit" size="large" style="width:5.5rem;">
            <el-option
                v-for="limit in tableProps.limitSelectOptions"
                :key="limit"
                :value="limit"
                :lable="limit"
            />
          </el-select>
        </template>
        <template #paginatorend>
          <el-button type="text" size="large" @click="handleExport">
            <template #icon>
              <el-icon class="pi pi-external-link"/>
            </template>
          </el-button>
        </template>
        <p-column field="enabled" header="状态" :showFilterMenu="false"
                  style="width:5rem;min-width:5rem;max-width:5rem;">
          <template #body="slotProps">
            <el-icon class="pi" :class="slotProps.data[slotProps.field]?'pi-check':'pi-ban'" style="width:100%;"/>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <p-tri-state-checkbox v-model="filterModel.value" @change="filterCallback()"/>
          </template>
        </p-column>
        <p-column
            field="id"
            header="用户名"
            :style="{width:'360px'}"
            :sortable="true"
        >
          <template #body="slotProps">
            <div style="width:100%;text-overflow:ellipsis;overflow:hidden">{{ slotProps.data[slotProps.field] }}</div>
          </template>
          <template #filter="{filterModel,filterCallback}">
            <el-input v-model="filterModel.value" @change="filterCallback()"/>
          </template>
        </p-column>

        <p-column
            header="操作"
            frozen
            alignFrozen="right"
            :style="{width:'153px','min-width':'153px','max-width':'153px'}"
        >
          <template #body="slotProps">
            <view-part-action-column
                :slot-props="slotProps"
                @edit="handleEdit"
                @data-changed="onDataChanged"
            />
          </template>
        </p-column>

      </p-data-table>
    </el-main>
  </el-container>
  <view-part-edit-dialog
      v-model:visible="editDialogProps.visible"
      v-model:data="editDialogProps.data"
      @data-changed="onDataChanged"
  />
</template>

<script lang="ts">
import ViewPartEditDialog from "./ViewPartEditDialog.vue"
import {defineComponent, reactive, ref, shallowReactive, watch} from "vue";
import PDataTable from "primevue/datatable";
import PColumn from "primevue/column";
import {FilterMatchMode} from "primevue/api";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {buildFromPrimeVueDataTableFilters} from "@/libs/services/psr-entity-crud/buildFromPrimeVueDataTableFilters";
import {Page, Pageable} from "@/libs/services/psr-entity-crud";
import {GroupEntity} from "@/services/portal/CRUDService";
import {useAppContext} from "@/libs/commons/app-context";
import {ROUTE_AUTHORIZATION_USER_LIST} from "../../../../route";
import {authorizationService} from "@/services/authorization";
import ViewPartActionColumn from "./ViewPartActionColumn.vue";
import {UserEntity} from "@/services/authorization/CRUDService";
import ViewPartHeader from "./ViewPartHeader.vue";

export default defineComponent({
  name: "admin-console-group-list",
  components: {
    ViewPartHeader,
    PDataTable,
    PColumn,
    PTriStateCheckbox,
    ViewPartEditDialog,
    ViewPartActionColumn,
  },
  setup() {
    const appContext = useAppContext()
    const tableRef = ref()
    const tableProps = shallowReactive({
      pageable: reactive({
        offset: 0,
        limit: 20,
      } as Pageable),
      limitSelectOptions: [10, 20, 50, 100],
      data: {} as Page<GroupEntity>,
      loading: false,
      filters: reactive({
        'id': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'enabled': {value: null, matchMode: FilterMatchMode.EQUALS}
      })
    })
    const editDialogProps = reactive({
      data: {},
      creating: true,
      visible: false
    })

    function loadTableData() {
      tableProps.loading = true
      const filterOptions = buildFromPrimeVueDataTableFilters(tableProps.filters)
      return authorizationService.crud.user.findAll(filterOptions, tableProps.pageable)
          .then(data => {
            tableProps.data = data
          }).finally(() => tableProps.loading = false)
    }

    function handleFind() {
      tableProps.pageable.offset = 0
      loadTableData()
    }

    function handleClearFilters() {
      tableProps.filters = {
        'id': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'enabled': {value: null, matchMode: FilterMatchMode.EQUALS}
      }
    }

    const onDataTableEvent = (event: any) => {
      tableProps.pageable.offset = event.first
      tableProps.pageable.limit = event.rows
      if (event.sortField) {
        tableProps.pageable.sort = event.sortField
        tableProps.pageable.dir = event.sortOrder > 0 ? 'ASC' : 'DESC'
      } else {
        delete tableProps.pageable.sort
        delete tableProps.pageable.dir
      }
      loadTableData()
    }

    watch(() => tableProps.pageable.limit, handleFind)

    function handleExport() {
      tableRef.value.exportCSV();
    }

    const canAdd = appContext.permission.usePermissionFlag(ROUTE_AUTHORIZATION_USER_LIST.name, ['add'])

    return {
      tableRef,
      tableProps,
      editDialogProps,
      handleFind,
      handleClearFilters,
      handleAdd: () => {
        editDialogProps.visible = true
      },
      handleEdit: (row: UserEntity) => {
        editDialogProps.data = row
        editDialogProps.visible = true
      },
      onDataTableEvent,
      onDataChanged: handleFind,
      handleExport,
      canAdd
    }
  }
})
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100%;
}

.ct-root {
  height: 100%;
}

.ct-main {
  padding: 0;
}
</style>