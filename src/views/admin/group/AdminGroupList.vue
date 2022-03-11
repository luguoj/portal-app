<template>
  <DataTable
      ref="tableRef"
      class="table p-datatable-sm psr-shadow"
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
      v-model:first="tableProps.offset"
      :rows="tableProps.limit"
      @page="onDataTableEvent($event)"
      @sort="onDataTableEvent($event)"
      :value="tableProps.data.content"
      :totalRecords="tableProps.data.totalElements"
      v-loading="tableProps.loading"
      v-model:filters="tableProps.filters"
      filterDisplay="row"
  >
    <template #header>
      <el-space wrap>
        <el-button type="primary" class="button" @click="handleFind">
          <template #icon>
            <el-icon class="pi pi-search"/>
          </template>
          查找
        </el-button>
        <el-button type="primary" class="button" @click="handleClearFilters">
          <template #icon>
            <el-icon class="pi pi-filter-slash"/>
          </template>
          重置
        </el-button>
        <el-button type="primary" class="button" @click="handleAdd">
          <template #icon>
            <el-icon #icon class="pi pi-plus"/>
          </template>
          添加
        </el-button>
      </el-space>
    </template>
    <template #empty>
      没有数据.
    </template>
    <template #paginatorstart>
      <el-select v-model="tableProps.limit" size="large" style="width:5.5rem;">
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
    <Column field="enabled" header="有效" :showFilterMenu="false"
            style="width:5rem;min-width:5rem;max-width:5rem;">
      <template #body="slotProps">
        <el-icon class="pi" :class="slotProps.data[slotProps.field]?'pi-check':'pi-ban'" style="width:100%;"/>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <TriStateCheckbox v-model="filterModel.value" @change="filterCallback()"/>
      </template>
    </Column>
    <Column
        field="code"
        header="编码"
        :style="{width:'120px'}"
        :sortable="true"
    >
      <template #body="slotProps">
        <div style="width:100%;text-overflow:ellipsis;overflow:hidden">{{ slotProps.data[slotProps.field] }}</div>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <el-input v-model="filterModel.value" @change="filterCallback()"/>
      </template>
    </Column>
    <Column
        field="description"
        header="描述"
        :style="{width:'240px'}"
        :sortable="true"
    >
      <template #body="slotProps">
        <div style="width:100%;text-overflow:ellipsis;overflow:hidden">{{ slotProps.data[slotProps.field] }}</div>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <el-input v-model="filterModel.value" @change="filterCallback()"/>
      </template>
    </Column>
    <Column
        header="操作"
        frozen
        alignFrozen="right"
        :style="{width:'153px','min-width':'153px','max-width':'153px'}"
    >
      <template #body="slotProps">
        <el-space wrap>
          <router-link
              :to="{name:ROUTE_NAME_ADMIN.GROUP_AUTHORITY,params:{groupId:slotProps.data.id}}"
              v-slot="{navigate}"
          >
            <el-button type="text" size="small" @click="navigate">授权</el-button>
          </router-link>
          <router-link
              :to="{name:ROUTE_NAME_ADMIN.GROUP_USER,params:{groupId:slotProps.data.id}}"
              v-slot="{navigate}"
          >
            <el-button type="text" size="small">用户</el-button>
          </router-link>
          <el-button type="text" size="small" @click="handleEdit(slotProps.data)">编辑</el-button>
          <psr-el-async-action-button
              type="text" size="small"
              :action="handleDelete"
              :action-params="slotProps.data"
          >删除
          </psr-el-async-action-button>
        </el-space>
      </template>
    </Column>
  </DataTable>
  <admin-group-edit-dialog
      v-model:visible="editDialogProps.visible"
      v-model:data="editDialogProps.data"
      @data-changed="onDataChanged"
  />
</template>

<script>
import PsrElHorizontalScrollBar from "@/components/psr-element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar";
import {reactive, ref, watch} from "vue";
import {portalEntityCRUDService} from "@/services/portal";
import AdminGroupEdit from "@/views/admin/group/AdminGroupEditDialog";
import AdminGroupEditDialog from "@/views/admin/group/AdminGroupEditDialog";
import {ElMessage, ElMessageBox} from "element-plus";
import PsrElAsyncActionButton from "@/components/psr-element-plus/buttons/PsrElAsyncActionButton";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import {FilterMatchMode} from "primevue/api";
import TriStateCheckbox from "primevue/tristatecheckbox";
import {buildFromPrimeVueDataTableFilters} from "@/modules/psr-entity-crud/buildFromPrimeVueDataTableFilters";
import {ROUTE_NAME_ADMIN} from "@/router/admin";

export default {
  name: "AdminGroupList",
  components: {
    DataTable,
    Column,
    TriStateCheckbox,
    PsrElAsyncActionButton,
    AdminGroupEditDialog,
    AdminGroupEdit,
    PsrElHorizontalScrollBar
  },
  setup() {
    const queryOptions = {
      offset: 0,
      limit: 0,
      sort: null,
      dir: null,
      filterOptions: null
    }
    const tableRef = ref()
    const tableProps = reactive({
      offset: 0,
      limit: 20,
      limitSelectOptions: [10, 20, 50, 100],
      data: {
        content: [],
        totalElements: 0
      },
      loading: false,
      filters: {
        'portalId': {value: process.env.VUE_APP_PORTAL_ID, matchMode: FilterMatchMode.EQUALS},
        'code': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'description': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'enabled': {value: null, matchMode: FilterMatchMode.EQUALS}
      }
    })
    const editDialogProps = reactive({
      data: {},
      creating: true,
      visible: false
    })

    function loadTableData() {
      tableProps.loading = true
      queryOptions.filterOptions = buildFromPrimeVueDataTableFilters(tableProps.filters)
      return portalEntityCRUDService.group.findAll(queryOptions)
          .then(data => {
            tableProps.data = data
          }).finally(() => tableProps.loading = false)
    }

    function handleFind() {
      tableProps.offset = 0
      queryOptions.offset = tableProps.offset
      queryOptions.limit = tableProps.limit
      loadTableData()
    }

    function handleClearFilters() {
      tableProps.filters = {
        'portalId': {value: process.env.VUE_APP_PORTAL_ID, matchMode: FilterMatchMode.EQUALS},
        'code': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'description': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'enabled': {value: null, matchMode: FilterMatchMode.EQUALS}
      }
    }

    const onDataTableEvent = (event) => {
      queryOptions.offset = event.first
      queryOptions.limit = event.rows
      if (event.sortField) {
        queryOptions.sort = event.sortField
        queryOptions.dir = event.sortOrder > 0 ? 'ASC' : 'DESC'
      } else {
        queryOptions.sort = null
        queryOptions.dir = null
      }
      loadTableData()
    }

    watch(() => tableProps.limit, handleFind)

    function handleExport() {
      tableRef.value.exportCSV();
    }

    return {
      tableRef,
      tableProps,
      editDialogProps,
      handleFind,
      handleClearFilters,
      handleAdd: () => {
        editDialogProps.visible = true
      },
      handleEdit: (row) => {
        editDialogProps.data = row
        editDialogProps.visible = true
      },
      handleDelete: (row) => {
        return ElMessageBox.confirm(
            `是否删除${row.code} - ${row.description}`,
            '确认删除'
        ).then(() => {
          return portalEntityCRUDService.group.delete({
            ids: [row.id]
          }).then(() => {
            ElMessage({
              message: '删除成功.',
              type: 'success',
            })
            handleFind()
          })
        }).catch(() => {
        })
      },
      onDataTableEvent,
      onDataChanged: handleFind,
      handleExport,
      ROUTE_NAME_ADMIN
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: 100%;
}

.ct-main {
  height: 100%;
  padding-top: 0;
}
</style>