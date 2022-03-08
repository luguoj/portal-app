<template>
  <el-config-provider :locale="locale">
    <Desktop></Desktop>
  </el-config-provider>
</template>

<script>
import {onMounted} from "vue";
import Desktop from "@/desktop/Desktop";
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {useAuthorization} from "@/useAuthorization";
import {useMenuRoute} from "@/useMenuRoute";

export default {
  name: 'App',
  setup() {
    useAuthorization()
    useMenuRoute()
    onMounted(() => {
      window.NProgress.done()
    })
    return {
      locale: zhCn,
    }
  },
  components: {
    Desktop, ElConfigProvider
  }
}
</script>

<style>
#app {

}
</style>
