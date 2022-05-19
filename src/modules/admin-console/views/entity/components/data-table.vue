<template>
  <psr-filter-paging-data-table :model="model">
    <p-column
        v-for="columnDefinition in columnDefinitions" :key="columnDefinition.field"
        :field="columnDefinition.field"
        :header="columnDefinition.header"
        :style="{width:'150px'}"
        :sortable="true"
        :data-type="columnDefinition.type"
    >
      <template #body="slotProps">
        <div style="width:100%;text-overflow:ellipsis;overflow:hidden">{{ slotProps.data[slotProps.field] }}</div>
      </template>
      <template #filter="{filterModel,filterCallback}">
        <p-tri-state-checkbox
            v-if="columnDefinition.type==='boolean'"
            v-model="filterModel.value"
            @change="filterCallback()"
            style="width:100%"
        />
        <el-input
            v-else-if="columnDefinition.type==='string'"
            v-model="filterModel.value"
            @change="filterCallback()"
            style="width:100%"
        />
        <el-date-picker
            v-else-if="columnDefinition.type==='date'"
            v-model="filterModel.value"
            @change="filterCallback()"
            style="width:100%"
        />
        <el-input-number
            v-else-if="columnDefinition.type==='number'"
            v-model="filterModel.value"
            @change="filterCallback()"
            :controls="false"
            :precision="3"
            style="width:100%"
        />
      </template>
    </p-column>
    <p-column
        header="操作"
        frozen
        alignFrozen="right"
        :style="{width:'84px','min-width':'84px','max-width':'84px'}"
    >
      <template #body="{data}">
        <el-space wrap>
          <el-button
              v-if="canEdit"
              type="text"
              size="small"
              @click="$emit('edit',data)"
          >编辑
          </el-button>
          <psr-async-action-button
              v-if="canDelete"
              type="text" size="small"
              :action="handleDelete"
              :action-params="data"
          >删除
          </psr-async-action-button>
        </el-space>
      </template>
    </p-column>
  </psr-filter-paging-data-table>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import PsrFilterPagingDataTable from "@/libs/components/psr/widgets/data-table/filter-paging/index.vue";
import PColumn from "primevue/column";
import PTriStateCheckbox from "primevue/tristatecheckbox";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {ElMessage, ElMessageBox} from "element-plus/es";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import PsrAsyncActionDropdownItem from "@/libs/components/psr/widgets/dropdown-item/async-action/index.vue";
import {GroupEntity} from "@/services/portal/types";
import {usePermissionFlag} from "@/libs/commons/psr/app-context/usePermissionFlag";
import {ROUTE_ENTITY} from "@/modules/admin-console/route/entity";
import {CommonEntity, DomainSchema, entityService} from "@/services/entity";
import {checkFieldType, FieldType} from "@/modules/admin-console/views/entity/checkFieldType";

interface ColumnDefinition {
  field: string,
  header: string,
  type: FieldType
}

export default defineComponent({
  name: "data-table",
  components: {
    PsrFilterPagingDataTable,
    PColumn,
    PTriStateCheckbox,
    PsrAsyncActionButton,
    PsrAsyncActionDropdownItem
  },
  emits: ['edit', 'dataChanged'],
  props: {
    application: {
      type: String,
      default: ''
    },
    domainType: {
      type: String,
      default: ''
    },
    fieldSchemas: {
      type: Array as PropType<DomainSchema[]>
    },
    model: {
      type: Object as PropType<PsrCreateUpdateFormDialogModel<CommonEntity>>
    }
  },
  setup(props, context) {
    const canEdit = usePermissionFlag('route', ROUTE_ENTITY.name, ['edit'])
    const canDelete = usePermissionFlag('route', ROUTE_ENTITY.name, ['delete'])
    const columnDefinitions = computed<ColumnDefinition[]>(() => {
      const _columnDefinitions: ColumnDefinition[] = []
      if (props.fieldSchemas && props.fieldSchemas.length > 0) {
        for (const fieldSchema of props.fieldSchemas) {
          const type = checkFieldType(fieldSchema)
          _columnDefinitions.push({
            field: fieldSchema.name,
            header: fieldSchema.description,
            type
          })
        }
      }
      return _columnDefinitions
    })
    return {
      handleDelete: (row: GroupEntity) => {
        return ElMessageBox.confirm(
            `是否删除: ${row.id}`,
            '确认删除'
        ).then(() => {
          return entityService.crud.delete(props.application, props.domainType, [row.id!]).then(() => {
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
      canEdit,
      canDelete,
      columnDefinitions
    }
  }
})
</script>

<style scoped>

</style>