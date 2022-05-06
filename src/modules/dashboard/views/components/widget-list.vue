<template>
  <el-collapse>
    <el-collapse-item v-for="catalog in widgets" :key="catalog.name" :title="catalog.title">
      <div
          v-for="widget in catalog.widgets" :key="widget.name"
          style="padding:10px;height:90px;width:160px"
      >
        <div class="widget-item" style="height:100%;width:100%;" @click="$emit('addWidget',widget)">
          <el-skeleton style="height:100%;width:100%;">
            <template #template>
              <el-skeleton-item variant="image" style="height:100%;width:100%;"/>
            </template>
          </el-skeleton>
        </div>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {PsrDashboardWidgetCatalog} from "../../types/PsrDashboardWidget";

export default defineComponent({
  name: "widget-list",
  props: {
    widgets: {
      type: Object as PropType<PsrDashboardWidgetCatalog[]>,
      default: []
    }
  },
  emits: ['addWidget']
})
</script>

<style lang="scss" scoped>
.widget-item {
  &:hover {
    cursor: pointer;
  }
}
</style>