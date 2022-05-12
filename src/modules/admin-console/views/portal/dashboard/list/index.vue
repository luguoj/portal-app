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
import {DashboardTemplateEntity, DashboardTemplateType} from "@/services/portal/types";
import {portalService} from "@/services/portal";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";

interface NodeData {
  id: string,
  path: string,
  code?: string,
  description?: string,
  enabled?: boolean,
  type?: DashboardTemplateType,
  dashboardTemplate?: DashboardTemplateEntity,
  children: NodeData[]
}

function buildNodeData(entities: DashboardTemplateEntity[]): NodeData[] {
  const records: NodeData[] = []
  const recordByPath: Record<string, NodeData> = {}
  let pathIndex = 0
  for (const dashboardTemplateEntity of entities) {
    const pathItems = dashboardTemplateEntity.code!.split('/')
    let fullPath = ''
    let parentPathNode: NodeData | null = null
    for (let i = 0; i < pathItems.length; i++) {
      const pathItem = pathItems[i];
      fullPath += pathItem
      let newParentPathNode = recordByPath[fullPath]
      if (!newParentPathNode) {
        newParentPathNode = recordByPath[fullPath] = {
          id: 'path-' + pathIndex,
          path: pathItem,
          children: []
        }
        if (parentPathNode !== null) {
          parentPathNode.children.push(newParentPathNode)
        }
        if (i === 0) {
          records.push(newParentPathNode)
        }
        pathIndex++
      }
      if (i === pathItems.length - 1) {
        newParentPathNode.id = dashboardTemplateEntity.id!
        newParentPathNode.description = dashboardTemplateEntity.description
        newParentPathNode.enabled = dashboardTemplateEntity.enabled
        newParentPathNode.type = dashboardTemplateEntity.type
        newParentPathNode.dashboardTemplate = dashboardTemplateEntity
      }
      parentPathNode = newParentPathNode
    }
  }
  return records
}

if (typeof process.env.VUE_APP_PORTAL_ID !== 'string') {
  throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const portalId: string = process.env.VUE_APP_PORTAL_ID
export default defineComponent({
  name: "admin-console-portal-dashboard-list",
  components: {
    HeaderBar,
    EditDialog,
    DataTable
  },
  setup() {
    const dataTable: PsrFilterTreeTableModel<NodeData> = PsrFilterTreeTableModel.create<NodeData>({
      loadDataHandler: () => {
        return portalService.crud.dashboardTemplate.findAll(
            new FilterOptionsBuilder().field('portalId').iEqual(portalId).then().get()
        ).then(data => {
          return buildNodeData(data.content)
        })
      },
      defaultFilters: () => {
        return {
          'path': null,
          'description': null,
          'enabled': null,
          'type': null
        }
      }
    })
    const editDialog = PsrCreateUpdateFormDialogModel.create<DashboardTemplateEntity>({
      defaultData: () => {
        return {
          id: '',
          version: 0,
          code: '',
          description: '',
          enabled: false,
          type: 'masonry',
          portalId,
          content: ''
        }
      },
      createHandler: (data: DashboardTemplateEntity) => {
        return portalService.crud.dashboardTemplate.create({
          ...data
        })
      },
      updateHandler: (data: DashboardTemplateEntity) => {
        return portalService.crud.dashboardTemplate.patch(
            ['enabled', 'code', 'description'],
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

<style scoped>

</style>