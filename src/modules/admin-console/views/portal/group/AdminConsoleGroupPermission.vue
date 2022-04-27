<template>
  <el-container class="ct-root" v-loading="tableProps.loading">
    <el-header class="fit">
      <psr-toolbar>
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
      </psr-toolbar>
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
            {{ `[${slotProps.node.data.name}]${slotProps.node.data.title}` }}
            <template v-if="slotProps.node.data.permission!==undefined">
              <el-divider direction="vertical"/>
              <el-checkbox
                  label="access"
                  v-model="routeRoutePermissionStatusMap[slotProps.node.data.permission.key].access"
              />
              <template v-if="slotProps.node.data.permission.permissions!==undefined&&slotProps.node.data.permission.permissions.length>0">
                <el-divider direction="vertical"/>
                <el-checkbox-group
                    :disabled="!routeRoutePermissionStatusMap[slotProps.node.data.permission.key].access"
                    v-model="routeRoutePermissionStatusMap[slotProps.node.data.permission.key].actions"
                >
                  <el-checkbox
                      v-for="permission in slotProps.node.data.permission.permissions" :key="`${slotProps.node.data.permission.key}:${permission}`"
                      :label="permission"
                  />
                </el-checkbox-group>
              </template>
            </template>
          </template>
        </p-column>
        <p-column field="name" hidden/>
        <p-column field="titlePinyin" hidden/>
      </p-tree-table>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import PTreeTable from "primevue/treetable";
import {defineComponent, onMounted, reactive, ref, shallowReactive} from "vue";
import {portalService} from "@/services/portal";
import PColumn from "primevue/column";
import {useRouter} from "vue-router";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";
import {Queue} from "@/libs/commons/psr/promise-queue";
import {GroupEntity, GroupPermissionEntity} from "@/services/portal/CRUDService";
import {UnwrapNestedRefs} from "@vue/reactivity";
import pinyin from "pinyin";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {PsrAppRouteMetaPermission, PsrAppRouteRecord} from "@/libs/commons/psr/app-context/route";
import {ROUTE_PORTAL_GROUP_LIST} from "@/modules/admin-console/route";
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/PsrToolbar.vue";

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
    permission?: PsrAppRouteMetaPermission,
  },
  children?: RoutePermissionNode[]
}

function buildRoutePermissionNodes(
    routes: PsrAppRouteRecord[],
    routeRoutePermissionStatusMap: UnwrapNestedRefs<Record<string, RoutePermissionStatus>>
) {
  const nodes: RoutePermissionNode[] = []
  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const children: RoutePermissionNode[] = []
    if (route.children && route.children.length > 0) {
      children.push(...buildRoutePermissionNodes(route.children, routeRoutePermissionStatusMap))
    }
    if (route.meta.permission || children.length > 0) {
      const node: RoutePermissionNode = {
        key: route.name,
        data: {
          name: route.meta.nameRaw,
          title: route.meta.tag.title,
          iconCls: route.meta.tag.iconCls,
          permission: route.meta.permission,
        },
        children
      }
      if (node.data.title) {
        node.data.titlePinyin = pinyin(node.data.title, {style: pinyin.STYLE_NORMAL}).join('')
      }
      if (route.meta.permission) {
        routeRoutePermissionStatusMap[route.meta.permission.key] = {access: false, actions: [], entity: null}
      }
      nodes.push(node)
    }
  }
  return nodes
}

export default defineComponent({
  name: "admin-console-group-permission",
  components: {
    PTreeTable,
    PColumn,
    PsrToolbar
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
      tableProps.data = buildRoutePermissionNodes(router.options.routes as PsrAppRouteRecord[], routeRoutePermissionStatusByName)
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
    const backRouteName = useAppContext().router.computeModuleRouteName(ROUTE_PORTAL_GROUP_LIST.name)
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