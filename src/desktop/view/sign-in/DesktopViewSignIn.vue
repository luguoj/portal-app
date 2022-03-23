<template>
  <transition>
    <div class="psr-modal">
      <iframe class="iframe-sign-in" ref="signInFrame"/>
    </div>
  </transition>
</template>

<script lang="ts">
import {useSignInFrame} from "@/modules/psr-oauth/token-services/sso-client/useSignInFrame";
import {tokenContext} from "@/services/Authorization";
import {defineComponent} from "vue";

export default defineComponent({
  name: "DesktopViewSignIn",
  setup() {
    const signInFrame = useSignInFrame(tokenContext)
    return {
      signInFrame,
    }
  }
})
</script>

<style scoped>
.psr-modal {
  z-index: 2003;
}

.iframe-sign-in {
  width: 100%;
  height: 100%;
  border: none;
}
</style>