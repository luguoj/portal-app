<template>
  <el-config-provider :locale="locale">
    <Desktop></Desktop>
  </el-config-provider>
</template>

<script lang="ts">
import {defineComponent, onMounted} from "vue";
import Desktop from "@/desktop/Desktop.vue";
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {useAuthorization} from "@/useAuthorization";
import {usePermission} from "@/usePermission";

declare const NProgress: any

export default defineComponent({
  name: 'App',
  components: {
    Desktop, ElConfigProvider
  },
  setup() {
    useAuthorization()
    usePermission()
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
