<template>
  <div>{{ data }}</div>
</template>

<script lang="ts">
export default {
  name: "TextBlock"
}
</script>
<script setup lang="ts">
import {DataProviderProperties, useData} from "@psr-framework/vue3-plugin-dashboard"

const props = defineProps<{
  itemProperties: DataProviderProperties
}>()
const data = useData(props.itemProperties)
</script>

<style scoped>

</style>