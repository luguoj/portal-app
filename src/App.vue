<template>
  <el-config-provider :locale="locale">
    <router-view></router-view>
  </el-config-provider>
</template>

<script lang="ts">
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {defineComponent, onMounted} from "vue";
import {useAppContext} from "@/libs/commons/app-context";

declare const NProgress: any

export default defineComponent({
  name: 'App',
  components: {
    ElConfigProvider
  },
  setup() {
    onMounted(() => {
      NProgress.done()
    })
    return {
      locale: zhCn,
    }
  }
})
</script>

<style lang="scss">
#app {
}

::-webkit-scrollbar {
  width: 6px
}

::-webkit-scrollbar:horizontal {
  height: 6px
}

::-webkit-scrollbar-track {
  border-radius: 10px
}

::-webkit-scrollbar-thumb {
  background-color: #0003;
  border-radius: 10px;
  transition: all .2s ease-in-out
}

::-webkit-scrollbar-thumb:hover {
  cursor: pointer;
  background-color: #0000004d
}

html {
  font-size: var(--el-font-size-base)
}
</style>
