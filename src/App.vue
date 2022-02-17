<template>
  <Desktop></Desktop>
</template>

<script>
import {onMounted} from "vue";
import Desktop from "@/views/Desktop";

export default {
  name: 'App',
  setup() {
    onMounted(() => {
      window.NProgress.done()
    })
  },
  components: {
    Desktop
  }
}
</script>

<style>
#app {

}
</style>
