<template>
  <el-config-provider :locale="locale">
    <Desktop></Desktop>
  </el-config-provider>
</template>

<script>
import {onMounted} from "vue";
import Desktop from "@/views/Desktop";
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  name: 'App',
  setup() {
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
