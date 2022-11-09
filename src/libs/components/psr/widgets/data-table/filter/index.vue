<template>
  <p-data-table
      ref="tableRef"
      class="p-datatable-sm"
      responsiveLayout="scroll"
      :scrollable="true"
      scrollHeight="flex"
      scrollDirection="both"
      :resizableColumns="true"
      columnResizeMode="expand"
      :value="model.data"
      v-model:filters="model.filters"
      filterDisplay="row"
      stripedRows
      showGridlines
  >
    <template #empty>
      没有数据.
    </template>
    <slot/>
  </p-data-table>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import PDataTable from "primevue/datatable";
import DataTable from "primevue/datatable";
import {PsrFilterDataTableModel} from "./PsrFilterDataTableModel";

export default defineComponent({
  name: "psr-filter-data-table",
  components: {
    PDataTable
  },
  props: {
    model: {
      type: Object as PropType<PsrFilterDataTableModel<any>>,
      required: true
    }
  },
  setup() {
    const tableRef = ref<DataTable>()

    function handleExport() {
      tableRef.value?.exportCSV();
    }

    return {
      tableRef,
      handleExport
    }
  }
})
</script>

<style scoped>

</style>