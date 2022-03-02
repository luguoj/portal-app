<template>
  <transition>
    <div class="psr-modal">
      <iframe class="iframe-sign-in" ref="signInFrame"/>
    </div>
  </transition>
</template>

<script>
import {tokenService} from "@/services/Authorization";

export default {
  name: "DesktopViewSignIn",
  setup() {
    const signInFrame = tokenService.useSignInFrame()
    return {
      signInFrame,
    }
  }
}
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