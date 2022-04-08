<template>
  <el-container class="ct-root" v-loading="tableProps.loading">
    <el-header class="psr-el-toolbar">
      <el-space wrap>
        <router-link
            :to="{name:backRouteName}"
            custom
            v-slot="{navigate}"
        >
          <el-button type="text" @click="navigate">
            <template #icon>
              <el-icon class="pi pi-arrow-left"/>
            </template>
            返回
          </el-button>
        </router-link>
        <el-divider direction="vertical"/>
        <span>分组: {{ groupEntity.code }}</span>
        <el-divider direction="vertical"/>
        <el-button class="button" @click="initTableData">
          <template #icon>
            <el-icon class="pi pi-refresh"/>
          </template>
          刷新
        </el-button>
        <el-button class="button" @click="handleClearFilters">
          <template #icon>
            <el-icon class="pi pi-filter-slash"/>
          </template>
          重置
        </el-button>
        <el-button class="button" @click="handleSave">
          <template #icon>
            <el-icon class="pi pi-save"/>
          </template>
          保存
        </el-button>
      </el-space>
    </el-header>
    <el-main class="ct-main">
      <p-tree-table
          ref="tableRef"
          class="table p-treetable-sm"
          :scrollable="true"
          scrollHeight="flex"
          :filters="tableProps.filters"
          filterMode="lenient"
          :value="tableProps.data"
      >
        <p-column field="title" header="许可" :expander="true" style="min-width:720px">
          <template #filter>
            <el-input
                type="text"
                placeholder="过滤 (路由名称 / 标题 / 拼音)"
                v-model="tableProps.filters.global"
                class="p-column-filter"
            />
          </template>
          <template #body="slotProps">
            <el-checkbox
                :label="`[${slotProps.node.data.name}]${slotProps.node.data.title}`"
                v-model="routeRoutePermissionStatusMap[slotProps.node.key].access"
            />
            <el-divider direction="vertical"/>
            <el-checkbox-group
                :disabled="!routeRoutePermissionStatusMap[slotProps.node.key].access"
                v-model="routeRoutePermissionStatusMap[slotProps.node.key].actions"
            >
              <el-checkbox
                  v-for="action in slotProps.node.data.actions" :key="`${slotProps.node.key}:${action}`"
                  :label="action"
              />
            </el-checkbox-group>
          </template>
        </p-column>
        <p-column field="name" hidden/>
        <p-column field="titlePinyin" hidden/>
      </p-tree-table>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {ADMIN_CONSOLE_ROUTE_NAME} from "@/modules/admin-console/route";
import PTreeTable from "primevue/treetable";
import {defineComponent, onMounted, reactive, ref, shallowReactive} from "vue";
import {portalService} from "@/services/portal";
import PColumn from "primevue/column";
import {useRouter} from "vue-router";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";
import {Queue} from "@/libs/commons/promise-queue";
import {GroupEntity, GroupPermissionEntity} from "@/services/portal/CRUDService";
import {PSRRouteRecordRaw} from "psr-app-context/route";
import {UnwrapNestedRefs} from "@vue/reactivity";
import pinyin from "pinyin";
import {computeModuleRouteName} from "psr-app-context/computeModuleRoute";

interface RoutePermissionStatus {
  access: boolean,
  actions: string[],
  entity: GroupPermissionEntity | null
}

interface RoutePermissionNode {
  key: string,
  data: {
    name: string,
    title?: string | undefined,
    titlePinyin?: string,
    iconCls?: string | null,
    actions?: string[] | null
  },
  children?: RoutePermissionNode[]
}

function buildRoutePermissionNodes(
    routes: PSRRouteRecordRaw[],
    routeRoutePermissionStatusMap: UnwrapNestedRefs<Record<string, RoutePermissionStatus>>
) {
  const nodes: RoutePermissionNode[] = []
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const children: RoutePermissionNode[] = []
    if (route.children && route.children.length > 0) {
      children.push(...buildRoutePermissionNodes(route.children, routeRoutePermissionStatusMap))
    }
    if (route.meta?.permission || children.length > 0) {
      const node: RoutePermissionNode = {
        key: route.name,
        data: {
          name: route.name,
          title: route.meta?.tag?.title,
          iconCls: route.meta?.tag?.iconCls,
          actions: route.meta?.permission || []
        }
      }
      if (children) {
        node.children = children
      }
      if (node.data.title) {
        node.data.titlePinyin = pinyin(node.data.title, {style: pinyin.STYLE_NORMAL}).join('')
      }
      routeRoutePermissionStatusMap[route.name] = {access: false, actions: [], entity: null}
      nodes.push(node)
    }
  }
  return nodes
}

export default defineComponent({
  name: "admin-console-group-permission",
  components: {
    PTreeTable,
    PColumn
  },
  props: {
    groupId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const router = useRouter()
    const groupEntity = ref({} as GroupEntity)
    const routeRoutePermissionStatusByName = reactive({} as Record<string, RoutePermissionStatus>)
    const tableProps = shallowReactive({
      data: [] as RoutePermissionNode[],
      filters: reactive({global: ''}),
      loading: false
    })

    function initTableData() {
      tableProps.loading = true
      tableProps.data = buildRoutePermissionNodes(router.options.routes as PSRRouteRecordRaw[], routeRoutePermissionStatusByName)
      portalService.crud.group.findAllById([props.groupId]).then(data => {
        if (data && data.length > 0) {
          groupEntity.value = data[0]
          return portalService.crud.groupPermission.findAll(
              new FilterOptionsBuilder().field('groupId').iEqual(data[0].id!).then().get()
          ).then(data => {
            for (let i = 0; i < data.content.length; i++) {
              const groupPermissionEntity = data.content[i];
              routeRoutePermissionStatusByName[groupPermissionEntity.route!] = {
                access: true,
                actions: groupPermissionEntity.actions?.split(',') || [],
                entity: groupPermissionEntity
              }
            }
          })
        }
      }).finally(() => {
        tableProps.loading = false
      })
    }

    function handleClearFilters() {
      tableProps.filters.global = ''
    }

    const saveQueue = new Queue()

    function handleSave() {
      if (saveQueue.flushing) {
        return
      }
      saveQueue.enqueue(resolve => {
        tableProps.loading = true
        resolve(true)
      })
      for (const routeName in routeRoutePermissionStatusByName) {
        const groupPermission = routeRoutePermissionStatusByName[routeName]
        if (groupPermission.access) {
          if (!groupPermission.entity) {
            saveQueue.enqueue<GroupPermissionEntity>((resolve, reject) => {
              portalService.crud.groupPermission.create({
                groupId: groupEntity.value.id,
                route: routeName,
                actions: groupPermission.actions?.join(',')
              }).then(resolve).catch(reject)
            }).then(data => {
              groupPermission.entity = data
            })
          } else {
            const actions = groupPermission.actions?.join(',')
            if (actions !== groupPermission.entity.actions) {
              const {id, version} = groupPermission.entity
              saveQueue.enqueue<GroupPermissionEntity>((resolve, reject) => {
                portalService.crud.groupPermission.patch(
                    ['actions'],
                    {id, version, actions}
                ).then(resolve).catch(reject)
              }).then(data => groupPermission.entity = data)
            }
          }
        } else {
          if (groupPermission.entity) {
            const ids = [groupPermission.entity.id!]
            saveQueue.enqueue((resolve, reject) => {
              portalService.crud.groupPermission.delete(ids)
                  .then(resolve).catch(reject)
            }).then(() => groupPermission.entity = null)
          }
        }
      }
      saveQueue.enqueue(resolve => {
        tableProps.loading = false
        resolve(true)
      })
    }

    onMounted(() => {
      initTableData()
    })
    const backRouteName = computeModuleRouteName(ADMIN_CONSOLE_ROUTE_NAME.GROUP_LIST)
    return {
      groupEntity,
      tableProps,
      routeRoutePermissionStatusMap: routeRoutePermissionStatusByName,
      backRouteName,
      initTableData,
      handleClearFilters,
      handleSave
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