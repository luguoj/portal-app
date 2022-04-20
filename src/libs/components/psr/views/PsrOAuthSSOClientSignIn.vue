<template>
  <transition>
    <div class="psr-modal">
      <iframe class="iframe-sign-in" ref="signInFrame"/>
    </div>
  </transition>
</template>

<script lang="ts">
import {useSignInFrame} from "@/libs/commons/app-context/plugins/token";
import {defineComponent} from "vue";

export default defineComponent({
  name: "psr-oauth-sso-client-sign-in",
  setup() {
    const signInFrame = useSignInFrame()
    return {
      signInFrame,
    }
  }
})
</script>

<style scoped>
.psr-modal {
  z-index: 2000;
}

.iframe-sign-in {
  width: 100%;
  height: 100%;
  border: none;
}
</style>