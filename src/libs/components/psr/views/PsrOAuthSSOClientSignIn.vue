<template>
  <transition>
    <div class="psr-modal">
      <iframe class="iframe-sign-in" ref="signInFrame"/>
    </div>
  </transition>
</template>

<script lang="ts">
import {useSSOSignInFrame} from "@psr-framework/vue3-plugin-platform-client";
import {defineComponent} from "vue";

export default defineComponent({
  name: "psr-oauth-sso-client-sign-in",
  setup() {
    const signInFrame = useSSOSignInFrame()
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