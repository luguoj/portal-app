<template>
  <div class="psr-modal">
    <iframe
        ref="signinFrame"
        class="float"
        src=""
        frameborder=0
        width="100%"
        height="100%"
    />
  </div>
</template>

<script>
import {onBeforeMount, onBeforeUnmount, onMounted, ref} from "vue";

export default {
  name: "SignIn",
  emits: ['signin'],
  setup(props,context) {
    let signinFrame = ref(null)
    const onMessage = function (event) {
      if (event.data === 'login_success') {
        console.log('login message got')
        context.emit('signin')
      } else if (event.data === 'login_retry') {
        console.log('login retry message got', signinFrame.value)
        signinFrame.value.src = process.env.VUE_APP_PSR_AUTH_CLIENT_URL
      }
    }
    onMounted(() => {
      signinFrame.value.src = process.env.VUE_APP_PSR_AUTH_CLIENT_URL
    })
    onBeforeMount(() => {
      window.addEventListener('message', onMessage, false);
    })
    onBeforeUnmount(() => {
      window.removeEventListener('message', onMessage)
    })
    return {
      signinFrame
    }
  }
}
</script>

<style scoped>
</style>