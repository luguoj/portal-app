<template>
  <psr-filter-tree-table :model="model">
    <p-column field="title" header="许可" :expander="true" style="min-width:720px">
      <template #filter>
        <el-input
            type="text"
            placeholder="过滤 (路由名称 / 标题)"
            v-model="model.filters.global"
            class="p-column-filter"
        />
      </template>
      <template #body="{node:{key,data}}">
        {{ `[${data.nameRaw}]${data.title}` }}
        <template v-if="data.permissionKey">
          <el-divider direction="vertical"/>
          <el-checkbox
              label="access"
              v-model="data.access"
          />
          <template v-if="data.permissions&&data.permissions.length>0">
            <el-divider direction="vertical"/>
            <el-checkbox-group
                :disabled="!data.access"
                v-model="data.actions"
            >
              <el-checkbox
                  v-for="permission in data.permissions" :key="`${permission}`"
                  :label="permission"
              />
            </el-checkbox-group>
          </template>
        </template>
      </template>
    </p-column>
    <p-column field="permissionKey" hidden/>
  </psr-filter-tree-table>
</template>

<script lang="ts">
import {PropType} from "vue";
import {NodeData} from "../types/NodeData";
import PsrFilterTreeTable from "@/libs/components/psr/widgets/tree-table/filter/index.vue";
import PTreeTable from "primevue/treetable";
import PColumn from "primevue/column";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";

export default {
  name: "data-table",
  components: {
    PsrFilterTreeTable,
    PTreeTable,
    PColumn
  },
  props: {
    model: {
      type: Object as PropType<PsrFilterTreeTableModel<NodeData>>
    }
  }
}
</script>

<style scoped>

</style>