<template>
  <p-tree-table
      class="p-treetable-sm"
      :scrollable="true"
      scrollHeight="flex"
      scrollDirection="both"
      :resizableColumns="true"
      columnResizeMode="expand"
      :filters="model.filters"
      filterMode="lenient"
      :value="model.rootNodes"
  >
    <slot/>
  </p-tree-table>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import PTreeTable from "primevue/treetable";
import {PsrFilterTreeTableModel} from "@/libs/components/psr/widgets/tree-table/filter/PsrFilterTreeTableModel";

export default defineComponent({
  name: "psr-filter-tree-table",
  components: {
    PTreeTable
  },
  props: {
    model: {
      type: Object as PropType<PsrFilterTreeTableModel<any>>,
      required: true
    }
  }
})
</script>

<style scoped>

</style>