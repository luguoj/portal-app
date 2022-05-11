<template>
  <el-container class="ct-root" v-loading="dataTable.loading||saving">
    <el-header class="fit">
      <header-bar
          :group-code="groupEntity.code"
          :dirty="dirtyData.flag"
          @refresh="dataTable.load()"
          @clearFilters="dataTable.clearFilters()"
          @save="handleSave"
      />
    </el-header>
    <el-main class="ct-main">
      <data-table :model="dataTable" :expanded-keys="expandedKeys"/>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import {portalService} from "@/services/portal";
import {useRouter} from "vue-router";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";
import {Queue} from "@/libs/commons/psr/promise-queue";
import {PsrAppRouteRecord} from "@/libs/commons/psr/app-context/route";
import {GroupEntity, GroupPermissionEntity} from "@/services/portal/types";
import HeaderBar from "./components/header-bar.vue";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {NodeData} from "@/modules/admin-console/views/portal/group/permission/types/NodeData";
import DataTable from "./components/data-table.vue";
import {PsrAppWidgetCatalog} from "@/libs/commons/psr/app-context/widget-manager";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {keysIn} from "lodash";

function buildWidgetPermissionData(
    widgets: PsrAppWidgetCatalog[],
    groupPermissionByWidget: { [key: string]: GroupPermissionEntity }
) {
  const records: NodeData[] = []
  for (let i = 0; i < widgets.length; i++) {
    const catalog = widgets[i];
    const catalogNode: NodeData = {
      id: 'widget-' + catalog.name,
      nameRaw: catalog.name,
      title: catalog.title,
      iconCls: catalog.iconCls,
      permissionUsage: 'widget',
      permissionKey: undefined,
      permissions: undefined,
      access: true,
      actions: [],
      originAccess: true,
      originActions: [],
      groupPermission: null,
      children: []
    }
    records.push(catalogNode)
    for (let j = 0; j < catalog.widgets.length; j++) {
      const widget = catalog.widgets[j];
      const permissionKey = widget.name
      const originAccess = !!groupPermissionByWidget[permissionKey]
      const originActions = groupPermissionByWidget[permissionKey]?.actions?.split(',') || []
      const widgetNode: NodeData = {
        id: 'widget-' + widget.name,
        nameRaw: widget.nameRaw,
        title: widget.title,
        iconCls: widget.iconCls,
        permissionUsage: 'widget',
        permissionKey,
        permissions: widget.permissions ? widget.permissions : undefined,
        access: originAccess,
        actions: originActions,
        originAccess,
        originActions,
        groupPermission: groupPermissionByWidget[widget.name],
        children: []
      }
      catalogNode.children.push(widgetNode)
    }
  }
  return records
}

function buildRoutePermissionData(
    routes: PsrAppRouteRecord[],
    groupPermissionByRoute: { [key: string]: GroupPermissionEntity }
) {
  const records: NodeData[] = []
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    let children: NodeData[] = []
    if (route.children && route.children.length > 0) {
      children = buildRoutePermissionData(route.children, groupPermissionByRoute)
    }
    if (route.meta.permissions || children.length > 0) {
      const permissionKey = route.name
      const originAccess = !!groupPermissionByRoute[permissionKey]
      const originActions = groupPermissionByRoute[permissionKey]?.actions?.split(',') || []
      const node: NodeData = {
        id: 'route-' + route.name,
        nameRaw: route.meta.nameRaw,
        title: route.meta.tag.title,
        iconCls: route.meta.tag.iconCls,
        permissionUsage: 'route',
        permissionKey,
        permissions: route.meta.permissions ? route.meta.permissions : undefined,
        access: originAccess,
        actions: originActions,
        originAccess,
        originActions,
        groupPermission: groupPermissionByRoute[permissionKey],
        children
      }
      records.push(node)
    }
  }
  return records
}

export default defineComponent({
  name: "admin-console-portal-group-permission",
  components: {
    HeaderBar,
    DataTable
  },
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const expandedKeys = ref<string[]>(['route', 'widget'])
    const router = useRouter()
    const widgetManager = useAppContext().widget
    const groupEntity = ref<GroupEntity>({})
    const dataTable: PsrFilterTreeTableModel<NodeData> = PsrFilterTreeTableModel.create<NodeData>({
      loadDataHandler: () => {
        return portalService.crud.group.findAllById([props.groupId]).then(data => {
          if (data && data.length > 0) {
            groupEntity.value = data[0]
            return portalService.crud.groupPermission.findAll(
                new FilterOptionsBuilder().field('groupId').iEqual(data[0].id!).then().get()
            ).then(data => {
              const groupPermissionByRoute: { [key: string]: GroupPermissionEntity } = {}
              const groupPermissionByWidget: { [key: string]: GroupPermissionEntity } = {}
              for (const datum of data.content) {
                if (datum.usage === 'route') {
                  groupPermissionByRoute[datum.key!] = datum
                } else if (datum.usage === 'widget') {
                  groupPermissionByWidget[datum.key!] = datum
                }
              }
              return [{
                id: 'route',
                nameRaw: 'route',
                title: '路由',
                iconCls: 'pi pi-map',
                permissionUsage: 'route',
                permissionKey: undefined,
                permissions: undefined,
                access: true,
                actions: [],
                originAccess: true,
                originActions: [],
                groupPermission: null,
                children: buildRoutePermissionData(router.options.routes as PsrAppRouteRecord[], groupPermissionByRoute)
              }, {
                id: 'widget',
                nameRaw: 'widget',
                title: '小组件',
                iconCls: 'pi pi-map',
                permissionUsage: 'widget',
                permissionKey: undefined,
                permissions: undefined,
                access: true,
                actions: [],
                originAccess: true,
                originActions: [],
                groupPermission: null,
                children: buildWidgetPermissionData(widgetManager.widgetCatalogRaws, groupPermissionByWidget)
              }] as NodeData[]
            })
          }
        })
      },
      defaultFilters: () => {
        return {global: ''}
      }
    })
    watch(() => dataTable.recordByKey, recordByKey => {
      expandedKeys.value = keysIn(recordByKey)
    })
    const dirtyData = computed<{
      flag: boolean,
      toCreate: NodeData[],
      toUpdate: NodeData[]
      toDelete: NodeData[]
    }>(() => {
      const result: {
        flag: boolean,
        toCreate: NodeData[],
        toUpdate: NodeData[]
        toDelete: NodeData[]
      } = {
        flag: false,
        toCreate: [],
        toUpdate: [],
        toDelete: []
      }
      for (const nodeId in dataTable.recordByKey) {
        const nodeData = dataTable.recordByKey[nodeId]
        if (nodeData.access) {
          if (!nodeData.originAccess) {
            result.toCreate.push(nodeData)
          } else {
            let dirty = (nodeData.actions.length !== nodeData.originActions.length)
            if (!dirty) {
              for (let i = 0; i < nodeData.actions.length; i++) {
                const action = nodeData.actions[i];
                if (!nodeData.originActions.includes(action)) {
                  dirty = false
                  break
                }
              }
            }
            if (dirty) {
              result.toUpdate.push(nodeData)
            }
          }
        } else {
          if (nodeData.originAccess) {
            result.toDelete.push(nodeData)
          }
        }
      }
      result.flag = result.toDelete.length > 0 || result.toCreate.length > 0 || result.toUpdate.length > 0
      return result
    })

    const saveQueue = new Queue()
    const saving = ref(false)

    function handleSave() {
      const _dirtyData = dirtyData.value
      if (saveQueue.flushing || !_dirtyData.flag) {
        return
      }
      saveQueue.enqueue(resolve => {
        saving.value = true
        resolve(true)
      })
      for (const toCreateElement of _dirtyData.toCreate) {
        saveQueue.enqueue<GroupPermissionEntity>((resolve, reject) => {
          portalService.crud.groupPermission.create({
            groupId: groupEntity.value.id,
            usage: toCreateElement.permissionUsage,
            key: toCreateElement.permissionKey,
            actions: toCreateElement.actions?.join(',')
          }).then(resolve).catch(reject)
        }).then(data => {
          toCreateElement.originAccess = true
          toCreateElement.originActions = data.actions ? data.actions.split(',') : []
          toCreateElement.groupPermission = data
        })
      }
      for (const toUpdateElement of _dirtyData.toUpdate) {
        const actions = toUpdateElement.actions?.join(',')
        const {id, version} = toUpdateElement.groupPermission!
        saveQueue.enqueue<GroupPermissionEntity>((resolve, reject) => {
          portalService.crud.groupPermission.patch(
              ['actions'],
              {id, version, actions}
          ).then(resolve).catch(reject)
        }).then(data => {
          toUpdateElement.originAccess = true
          toUpdateElement.originActions = data.actions ? data.actions.split(',') : []
          toUpdateElement.groupPermission = data
        })
      }
      for (const toDeleteElement of _dirtyData.toDelete) {
        const ids = [toDeleteElement.groupPermission!.id!]
        saveQueue.enqueue((resolve, reject) => {
          portalService.crud.groupPermission.delete(ids)
              .then(resolve).catch(reject)
        }).then(() => {
          toDeleteElement.originAccess = false
          toDeleteElement.originActions = []
          toDeleteElement.groupPermission = null
        })
      }
      saveQueue.enqueue(resolve => {
        saving.value = false
        resolve(true)
      })
    }

    onMounted(() => {
      dataTable.load()
    })
    return {
      expandedKeys,
      groupEntity,
      handleSave,
      dataTable,
      saving,
      dirtyData
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

.table {
  width: 100%;
  height: 100%;
}
</style>