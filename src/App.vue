<template>
</template>

<script>
import {onMounted} from "vue";

export default {
  name: 'App',
  setup() {
    onMounted(() => {
      window.NProgress.done()
    })
  },
  components: {
  }
}
</script>

<style>
#app {

}
</style>
