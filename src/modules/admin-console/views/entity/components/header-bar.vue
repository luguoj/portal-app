<template>
  <psr-toolbar>
    <el-select placeholder="应用" :model-value="application" @change="$emit('update:application',$event)">
      <el-option
          v-for="application in applications"
          :key="application.name"
          :value="application.name"
          :label="application.title"
      />
    </el-select>
    <el-select placeholder="领域类型" :model-value="domainType" @change="$emit('update:domainType',$event)">
      <el-option
          v-for="domainType in domainTypes"
          :key="domainType.type"
          :value="domainType.type"
          :label="domainType.title"
      />
    </el-select>
    <el-divider direction="vertical"/>
    <el-button @click="$emit('find')" :disabled="!domainType">
      <template #icon>
        <el-icon class="pi pi-search"/>
      </template>
      查找
    </el-button>
    <el-button @click="$emit('clearFilters')" :disabled="!domainType">
      <template #icon>
        <el-icon class="pi pi-filter-slash"/>
      </template>
      重置
    </el-button>
    <el-button v-if="canAdd" @click="$emit('add')" :disabled="!domainType">
      <template #icon>
        <el-icon class="pi pi-plus"/>
      </template>
      添加
    </el-button>
    <el-divider direction="vertical"/>
    <el-popover placement="bottom" trigger="click" width="fit-content">
      <template #reference>
        <el-button :disabled="!domainType">
          <template #icon>
            <el-icon class="pi pi-table"/>
          </template>
          选择列
        </el-button>
      </template>
      <el-transfer
          :model-value="selectedFieldNames"
          :props="{key: 'name', label: 'description'}"
          :data="fieldSchemas"
          @change="$emit('update:selectedFieldNames',$event)"
      />
    </el-popover>
  </psr-toolbar>
</template>

<script lang="ts">
import {defineComponent, PropType, ref, watch} from "vue";
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/base/index.vue";
import {usePermissionFlag} from "@/libs/commons/psr/app-context/usePermissionFlag";
import {ROUTE_ENTITY} from "@/modules/admin-console/route";
import {applications, DomainSchema, entityService} from "@/services/entity";

export default defineComponent({
  name: "header-bar",
  components: {
    PsrToolbar
  },
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
    selectedFieldNames: {
      type: Array as PropType<string[]>
    }
  },
  emits: ['add', 'find', 'clearFilters', 'update:application', 'update:domainType', 'update:selectedFieldNames'],
  setup(props, context) {
    const canAdd = usePermissionFlag('route', ROUTE_ENTITY.name, ['add'])
    const domainTypes = ref<DomainSchema[]>([])
    watch(() => props.application, application => {
      domainTypes.value = []
      context.emit('update:domainType', '')
      entityService.schema.findAllDomainType(application).then(_domainTypes => {
        domainTypes.value = _domainTypes
      })
    })
    return {
      canAdd,
      applications,
      domainTypes
    }
  }
})
</script>

<style scoped>

</style>