<template>
  <el-container class="ct-root" v-loading="tableProps.loading">
    <el-header class="psr-el-toolbar">
      <el-space wrap>
        <el-button class="button" @click="handleFind">
          <template #icon>
            <el-icon class="pi pi-search"/>
          </template>
          查找
        </el-button>
        <el-button class="button" @click="handleClearFilters">
          <template #icon>
            <el-icon class="pi pi-filter-slash"/>
          </template>
          重置
        </el-button>
        <el-button v-if="canAdd" class="button" @click="handleAdd">
          <template #icon>
            <el-icon class="pi pi-plus"/>
          </template>
          添加
        </el-button>
      </el-space>
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
            field="code"
            header="编码"
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
            field="description"
            header="描述"
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
            <el-space wrap>
              <router-link
                  v-if="canRoutePermission"
                  :to="{name:rowActionRoutes.permission,params:{groupId:slotProps.data.id}}"
              >
                <el-button type="text" size="small">许可</el-button>
              </router-link>
              <router-link
                  v-if="canRouteUser"
                  :to="{name:rowActionRoutes.user,params:{groupId:slotProps.data.id}}"
              >
                <el-button type="text" size="small">用户</el-button>
              </router-link>
              <el-button
                  v-if="canEdit"
                  type="text"
                  size="small"
                  @click="handleEdit(slotProps.data)"
              >编辑
              </el-button>
              <psr-el-async-action-button
                  v-if="canDelete"
                  type="text" size="small"
                  :action="handleDelete"
                  :action-params="slotProps.data"
              >删除
              </psr-el-async-action-button>
            </el-space>
          </template>
        </p-column>
      </p-data-table>
    </el-main>
  </el-container>
  <admin-console-group-edit-dialog
      v-model:visible="editDialogProps.visible"
      v-model:data="editDialogProps.data"
      @data-changed="onDataChanged"
  />
</template>

<script lang="ts">
import {defineComponent, reactive, ref, shallowReactive, watch} from "vue";
import {portalService} from "@/services/portal";
import AdminConsoleGroupEditDialog from "@/modules/admin-console/views/portal/group/AdminConsoleGroupEditDialog.vue";
import {ElMessage, ElMessageBox} from "element-plus";
import PsrElAsyncActionButton from "@/libs/components/psr/element-plus/buttons/PsrElAsyncActionButton.vue";
import PDataTable from "primevue/datatable";
import PColumn from "primevue/column";
import {FilterMatchMode} from "primevue/api";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {buildFromPrimeVueDataTableFilters} from "@/libs/services/psr-entity-crud/buildFromPrimeVueDataTableFilters";
import {Page, Pageable} from "@/libs/services/psr-entity-crud";
import {GroupEntity} from "@/services/portal/CRUDService";
import {useAppContext} from "@/libs/commons/app-context";
import {appContext} from "@/appContext";
import {ROUTE_PORTAL_GROUP_LIST, ROUTE_PORTAL_GROUP_PERMISSION, ROUTE_PORTAL_GROUP_USER} from "@/modules/admin-console/route";

export default defineComponent({
  name: "admin-console-group-list",
  components: {
    PDataTable,
    PColumn,
    PTriStateCheckbox,
    PsrElAsyncActionButton,
    AdminConsoleGroupEditDialog
  },
  setup() {
    const router = useAppContext().router
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
        'portalId': {value: process.env.VUE_APP_PORTAL_ID, matchMode: FilterMatchMode.EQUALS},
        'code': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'description': {value: null, matchMode: FilterMatchMode.CONTAINS},
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
      return portalService.crud.group.findAll(filterOptions, tableProps.pageable)
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
        'portalId': {value: process.env.VUE_APP_PORTAL_ID, matchMode: FilterMatchMode.EQUALS},
        'code': {value: null, matchMode: FilterMatchMode.CONTAINS},
        'description': {value: null, matchMode: FilterMatchMode.CONTAINS},
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

    const rowActionRoutes = {
      permission: router.computeModuleRouteName(ROUTE_PORTAL_GROUP_PERMISSION.name),
      user: router.computeModuleRouteName(ROUTE_PORTAL_GROUP_USER.name)
    }
    const canRoutePermission = appContext.permission.usePermissionFlag(ROUTE_PORTAL_GROUP_PERMISSION.name)
    const canRouteUser = appContext.permission.usePermissionFlag(ROUTE_PORTAL_GROUP_USER.name)
    const canDelete = appContext.permission.usePermissionFlag(ROUTE_PORTAL_GROUP_LIST.name, ['delete'])
    const canEdit = appContext.permission.usePermissionFlag(ROUTE_PORTAL_GROUP_LIST.name, ['edit'])
    const canAdd = appContext.permission.usePermissionFlag(ROUTE_PORTAL_GROUP_LIST.name, ['add'])
    return {
      tableRef,
      tableProps,
      editDialogProps,
      handleFind,
      handleClearFilters,
      handleAdd: () => {
        editDialogProps.visible = true
      },
      handleEdit: (row: GroupEntity[]) => {
        editDialogProps.data = row
        editDialogProps.visible = true
      },
      handleDelete: (row: GroupEntity) => {
        if (row && row.id) {
          const ids: string[] = [row.id]
          return ElMessageBox.confirm(
              `是否删除${row.code} - ${row.description}`,
              '确认删除'
          ).then(() => {
            return portalService.crud.group.delete(ids).then(() => {
              ElMessage({
                message: '删除成功.',
                type: 'success',
              })
              handleFind()
            })
          }).catch(() => {
            ElMessage({
              message: '删除失败.',
              type: 'error',
            })
          })
        }
      },
      onDataTableEvent,
      onDataChanged: handleFind,
      handleExport,
      rowActionRoutes,
      canRoutePermission,
      canRouteUser,
      canDelete,
      canEdit,
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