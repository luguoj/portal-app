<template>
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
    <span>模板: {{ templateCode }}</span>
    <el-divider direction="vertical"/>
    <el-button @click="$emit('refresh')">
      <template #icon>
        <el-icon class="pi pi-refresh"/>
      </template>
      刷新
    </el-button>
    <el-button @click="$emit('save')" :disabled="!dirty">
      <template #icon>
        <el-icon class="pi pi-save"/>
      </template>
      保存
    </el-button>
    <el-button @click="$emit('runTest')">
      <template #icon>
        <el-icon class="pi pi-caret-right"/>
      </template>
      测试
    </el-button>
    <el-divider direction="vertical"/>
    <el-button @click="$emit('export')">
      <template #icon>
        <el-icon class="pi pi-download"/>
      </template>
      导出
    </el-button>
    <psr-read-file-button
        :accept="`.${templateType}.design`"
        @load="$emit('import',$event)"
    >
      <template #icon>
        <el-icon class="pi pi-upload"/>
      </template>
      导入
    </psr-read-file-button>
    <el-divider direction="vertical"/>
    <slot/>
  </psr-toolbar>
</template>

<script lang="ts">
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/base/index.vue";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {ROUTE_PORTAL_DASHBOARD_LIST} from "@/modules/admin-console/route";
import {defineComponent} from "vue";
import PsrReadFileButton from "@/libs/components/psr/widgets/button/read-file/index.vue";

export default defineComponent({
  name: "design-header-bar",
  components: {PsrReadFileButton, PsrToolbar},
  props: {
    templateType: String,
    templateCode: String,
    dirty: Boolean
  },
  emits: ['refresh', 'save', 'runTest', 'export', 'import'],
  setup() {
    const backRouteName = useAppContext().router.computeModuleRouteName(ROUTE_PORTAL_DASHBOARD_LIST.name)
    return {
      backRouteName
    }
  }
})
</script>

<style scoped>

</style>