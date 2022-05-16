<template>
  <el-collapse>
    <el-menu>
      <el-sub-menu v-for="catalog in widgets" :key="catalog.name" :index="catalog.name">
        <template #title>
          <el-icon class="psr-widget-catalog-icon" :class="catalog.iconCls"/>
          <span>{{ catalog.title }}</span>
        </template>
        <el-menu-item v-for="widget in catalog.widgets" :key="widget.name" :index="widget.name" class="widget-item">
          <div class="widget-item-inner" @click="$emit('addWidget',widget)">
            <div class="psr-widget-thumbnail" :class="widget.thumbnailCls?widget.thumbnailCls:''"/>
            <div class="title">{{ widget.title }}</div>
          </div>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </el-collapse>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {useAppContext} from "@/libs/commons/psr/app-context";

export default defineComponent({
  name: "widget-list",
  emits: ['addWidget'],
  setup() {
    const widgetManager = useAppContext().widget
    return {
      widgets: widgetManager.widgetCatalogs
    }
  }
})
</script>

<style lang="scss" scoped>
.psr-widget-catalog-icon {
  background-size: 18px;
  background-repeat: no-repeat;
  background-position: center;
}

.widget-item {
  --thumbnail-height: 100px;
  --thumbnail-width: 190px;
  height: var(--thumbnail-height);
  padding: 0 10px !important;

  .widget-item-inner {
    height: var(--thumbnail-height);
    width: var(--thumbnail-width);

    .psr-widget-thumbnail {
      height: var(--thumbnail-height);
      width: var(--thumbnail-width);
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
      opacity: 0.7;
    }

    .title {
      position: absolute;
      height: var(--thumbnail-height);
      width: var(--thumbnail-width);
      line-height: var(--thumbnail-height);
      top: 0;
      text-align: center;
    }
  }
}
</style>