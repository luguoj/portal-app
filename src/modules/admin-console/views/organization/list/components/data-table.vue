<template>
  <psr-filter-tree-table :model="model">
    <p-column
        :hidden="!canEdit&&!canDelete"
        field="enabled" header="状态"
        filterMatchMode="equals"
        style="width:5rem;min-width:5rem;max-width:5rem;"
    >
      <template #body="{node:{key,data}}">
        <el-icon class="pi" :class="data.enabled?'pi-check':'pi-ban'" style="width:100%;"/>
      </template>
      <template #filter>
        <p-tri-state-checkbox v-model="model.filters.enabled"/>
      </template>
    </p-column>
    <p-column
        field="code"
        header="编码"
        :style="{width:'360px'}"
        :sortable="true"
        :expander="true"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ data.code }}</div>
      </template>
      <template #filter>
        <el-input v-model="model.filters.code"/>
      </template>
    </p-column>
    <p-column
        field="description"
        header="描述"
        :style="{width:'360px'}"
        :sortable="true"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ data.description }}</div>
      </template>
      <template #filter>
        <el-input v-model="model.filters.description"/>
      </template>
    </p-column>
    <p-column
        field="hierarchyId"
        header="层级ID"
        :style="{width:'360px'}"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ hierarchyDic[data.hierarchyId] ? hierarchyDic[data.hierarchyId] : data.hierarchyId }}</div>
      </template>
    </p-column>
    <p-column
        header="左值"
        :style="{width:'42px'}"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ data.organization.left }}</div>
      </template>
    </p-column>
    <p-column
        header="右值"
        :style="{width:'42px'}"
    >
      <template #body="{node:{key,data}}">
        <div class="psr-text-nowrap">{{ data.organization.right }}</div>
      </template>
    </p-column>
    <p-column
        header="操作"
        frozen
        alignFrozen="right"
        :style="{width:'153px','min-width':'153px','max-width':'153px'}"
    >
      <template #body="{node:{key,data},field}">
        <el-space wrap>
          <el-button
              v-if="canEdit"
              link
              size="small"
              @click="$emit('edit',data.organization)"
          >编辑
          </el-button>
          <psr-async-action-button
              v-if="canDelete"
              link
              size="small"
              :action="handleDelete"
              :action-params="data"
          >删除
          </psr-async-action-button>
          <router-link
              v-if="canRouteMember"
              :to="{name:memberRoute,params:{organizationId:data.id}}"
              custom
              v-slot="{navigate}"
          >
            <el-button
                link
                size="small"
                @click="navigate"
            >成员
            </el-button>
          </router-link>
        </el-space>
      </template>
    </p-column>
  </psr-filter-tree-table>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, ref, watch, watchEffect} from "vue";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";
import {OrganizationEntity} from "@/services/organization/types";
import PsrFilterTreeTable from "@/libs/components/psr/widgets/tree-table/filter/index.vue";
import PTreeTable from "primevue/treetable";
import PColumn from "primevue/column";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {ROUTE_ORGANIZATION_LIST, ROUTE_ORGANIZATION_MEMBER} from "@/modules/admin-console/route";
import {usePermissionFlag} from "@/libs/commons/psr/app-context/usePermissionFlag";
import {GroupEntity} from "@/services/portal/types";
import {ElMessage, ElMessageBox} from "element-plus/es";
import {organizationService} from "@/services/organization";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import {FilterOptionsBuilder} from "@/libs/services/psr-entity-crud";

export default defineComponent({
  name: "data-table",
  components: {
    PsrFilterTreeTable,
    PTreeTable,
    PColumn,
    PTriStateCheckbox,
    PsrAsyncActionButton
  },
  emits: ['edit', 'dataChanged'],
  props: {
    model: {
      type: Object as PropType<PsrFilterTreeTableModel<OrganizationEntity>>,
      required: true
    },
    organizationUseId: {
      type: String
    },
  },
  setup(props, context) {
    const appContext = useAppContext()
    const router = appContext.router
    const memberRoute = router.computeModuleRouteName(ROUTE_ORGANIZATION_MEMBER.name)
    const canRouteMember = usePermissionFlag('route', ROUTE_ORGANIZATION_MEMBER.name)
    const canDelete = usePermissionFlag('route', ROUTE_ORGANIZATION_LIST.name, ['delete'])
    const canEdit = usePermissionFlag('route', ROUTE_ORGANIZATION_LIST.name, ['edit'])
    watchEffect(() => {
      if (!canDelete.value && !canEdit.value) {
        props.model.filters.enabled = true
      } else {
        props.model.filters.enabled = null
      }
    })
    const hierarchyDic = ref<{ [key: string]: string }>({})
    onMounted(() => {
      watch(() => props.organizationUseId, organizationUseId => {
        hierarchyDic.value = {}
        if (organizationUseId) {
          organizationService.crud.organizationHierarchy.findAll(
              new FilterOptionsBuilder()
                  .field('organizationUseId').iEqual(organizationUseId)
                  .then().get(),
          ).then(result => {
            for (const organizationHierarchyEntity of result.content) {
              hierarchyDic.value[organizationHierarchyEntity.id!] = organizationHierarchyEntity.code!
            }
          })
        }
      }, {immediate: true})
    })
    return {
      handleDelete: (row: GroupEntity) => {
        return ElMessageBox.confirm(
            `是否删除: ${row.code}`,
            '确认删除'
        ).then(() => {
          return organizationService.organization.delete(row.id!).then(() => {
            ElMessage({
              message: '删除成功.',
              type: 'success',
            })
            context.emit('dataChanged')
          }).catch(() => {
            ElMessage({
              message: '删除失败.',
              type: 'error',
            })
          })
        }).catch(() => true)
      },
      memberRoute,
      canEdit,
      canDelete,
      canRouteMember,
      hierarchyDic
    }
  }
})
</script>

<style lang="scss" scoped>

</style>