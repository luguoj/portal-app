<template>
  <TreeTable
      ref="tableRef"
      class="table p-treetable-sm"
      :scrollable="true"
      scrollHeight="flex"
      :filters="tableProps.filters"
      filterMode="lenient"
      :value="tableProps.data"
      v-loading="tableProps.loading"
  >
    <template #header class="ct-header">
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
        <el-button type="primary" class="button" @click="handleRefresh">
          <template #icon>
            <el-icon class="pi pi-refresh"/>
          </template>
          刷新
        </el-button>
        <el-button type="primary" class="button" @click="handleClearFilters">
          <template #icon>
            <el-icon class="pi pi-filter-slash"/>
          </template>
          重置
        </el-button>
        <el-button type="primary" class="button" @click="handleSave">
          <template #icon>
            <el-icon #icon class="pi pi-save"/>
          </template>
          保存
        </el-button>
      </el-space>
    </template>
    <Column field="title" header="路由" :expander="true" style="min-width:720px">
      <template #filter>
        <el-input type="text" placeholder="过滤 (路由名称 / 标题 / 拼音)" v-model="tableProps.filters['global']" class="p-column-filter"/>
      </template>
      <template #body="slotProps">
        <el-checkbox
            :label="slotProps.node.data.title"
            v-model="groupPermissions[slotProps.node.key].access"
        />
        <el-divider direction="vertical"/>
        <el-checkbox-group
            :disabled="!groupPermissions[slotProps.node.key].access"
            v-model="groupPermissions[slotProps.node.key].actions"
        >
          <el-checkbox
              v-for="action in slotProps.node.data.actions" :key="`${slotProps.node.key}:${action}`"
              :label="action"
          />
        </el-checkbox-group>
      </template>
    </Column>
    <Column field="name" hidden/>
    <Column field="titlePinyin" hidden/>
  </TreeTable>
</template>

<script>
import {ROUTE_NAME_ADMIN} from "@/router/admin";
import TreeTable from "primevue/treetable";
import {onMounted, reactive, ref} from "vue";
import {portalEntityCRUDService} from "@/services/portal";
import Column from "primevue/column";
import pinyin from "pinyin";
import {useRouter} from "vue-router";
import {FilterOptionsBuilder} from "@/modules/psr-entity-crud";
import Checkbox from "primevue/checkbox";
import {Queue} from "@/modules/promiseQueue";


export default {
  name: "AdminGroupPermission",
  components: {
    TreeTable,
    Column,
    Checkbox
  },
  props: {
    groupId: {
      type: String
    }
  },
  setup(props) {
    const router = useRouter()
    const groupEntity = ref({})


    portalEntityCRUDService.group.findAllById({
      ids: [props.groupId]
    }).then(data => {
      if (data && data.length > 0) {
        groupEntity.value = data[0]
      }
    })

    const groupPermissions = reactive({})
    const tableProps = reactive({
      data: [],
      filters: {global: ''},
      loading: false
    })

    function buildRouteNodes(routes) {
      const nodes = []
      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        let children = []
        if (route.children && route.children.length > 0) {
          children = buildRouteNodes(route.children)
        }
        if (route.meta?.requirePermission || route.meta?.actions || children.length > 0) {
          groupPermissions[route.name] = {access: false, actions: [], entity: null}
          const node = {
            key: route.name,
            data: {
              title: route.meta?.title || route.name,
              titlePinyin: pinyin(route.meta?.title, {style: pinyin.STYLE_NORMAL}).join(''),
              iconCls: route.meta?.iconCls,
              actions: route.meta?.actions

            },
            children
          }
          nodes.push(node)
        }
      }
      return nodes
    }

    function initTableData() {
      tableProps.loading = true
      tableProps.data = buildRouteNodes(router.options.routes)
      loadGroupPermissionEntities()
    }

    function loadGroupPermissionEntities() {
      portalEntityCRUDService.groupPermission.findAll({
        filterOptions: new FilterOptionsBuilder().field('groupId').iEqual(groupEntity.id).then().get()
      }).then(data => {
        for (let i = 0; i < data.content.length; i++) {
          const groupPermissionEntity = data.content[i];
          if (groupPermissions[groupPermissionEntity.route]) {
            groupPermissions[groupPermissionEntity.route].access = true
            groupPermissions[groupPermissionEntity.route].actions = groupPermissionEntity.actions?.split(',')
            groupPermissions[groupPermissionEntity.route].entity = groupPermissionEntity
          } else {
            groupPermissions[groupPermissionEntity.route] = {
              access: false,
              actions: [],
              entity: groupPermissionEntity
            }
          }
        }
      }).finally(() => {
        tableProps.loading = false
      })
    }

    onMounted(() => {
      initTableData()
    })
    const saveQueue = new Queue()
    return {
      groupEntity,
      tableProps,
      groupPermissions,
      backRouteName: ROUTE_NAME_ADMIN.GROUP_LIST,
      handleRefresh: () => {
        initTableData()
      },
      handleClearFilters: () => {
        tableProps.filters.value.global = ''
      },
      handleSave: () => {
        saveQueue.enqueue(resolve => {
          tableProps.loading = true
          resolve()
        })
        for (const routeName in groupPermissions) {
          const groupPermission = groupPermissions[routeName]
          if (groupPermission.access) {
            if (!groupPermission.entity) {
              saveQueue.enqueue((resolve, reject) => {
                portalEntityCRUDService.groupPermission.create({
                  data: {
                    groupId: groupEntity.value.id,
                    route: routeName,
                    actions: groupPermission.actions?.join(',')
                  }
                }).then(resolve).catch(reject)
              }).then(data => {
                groupPermission.entity = data
              })
            } else {
              const actions = groupPermission.actions?.join(',')
              if (actions !== groupPermission.entity.actions) {
                const {id, version} = groupPermission.entity
                saveQueue.enqueue((resolve, reject) => {
                  portalEntityCRUDService.groupPermission.patch({
                    fields: ['actions'],
                    data: {id, version, actions}
                  }).then(resolve).catch(reject)
                }).then(data => groupPermission.entity = data)
              }
            }
          } else {
            if (groupPermission.entity) {
              saveQueue.enqueue((resolve, reject) => {
                portalEntityCRUDService.groupPermission.delete({
                  ids: [groupPermission.entity.id]
                }).then(resolve).catch(reject)
              }).then(() => groupPermission.entity = null)
            }
          }
        }
        saveQueue.enqueue(resolve => {
          tableProps.loading = false
          resolve()
        })
      }
    }
  }
}
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