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
      :paginator="true"
      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="{first} - {last} / {totalRecords}"
      :lazy="true"
      v-model:first="model.pageable.offset"
      :rows="model.pageable.limit"
      @page="onDataTableEvent"
      @sort="onDataTableEvent"
      :value="model.data.content"
      :totalRecords="model.data.totalElements"
      v-model:filters="model.filters"
      filterDisplay="row"
  >
    <template #empty>
      没有数据.
    </template>
    <template #paginatorstart>
      <el-select v-model="model.pageable.limit" size="large" style="width:5.5rem;">
        <el-option
            v-for="limit in model.limitSelectOptions"
            :key="limit"
            :value="limit"
            :lable="limit"
        />
      </el-select>
    </template>
    <template #paginatorend>
      <el-button type="text" size="large" @click="handleExport">
        <template #icon>
          <el-icon class="pi pi-external-link"/>
        </template>
      </el-button>
    </template>
    <slot/>
  </p-data-table>
</template>

<script lang="ts">
import {defineComponent, PropType, ref} from "vue";
import PDataTable from "primevue/datatable";
import {PsrPFilterPagingDataTableModel} from "./PsrPFilterPagingDataTableModel";

export default defineComponent({
  name: "PsrPFilterPagingDataTable",
  components: {
    PDataTable
  },
  props: {
    model: {
      type: Object as PropType<PsrPFilterPagingDataTableModel<any>>,
      required: true
    }
  },
  setup(props) {
    const tableRef = ref()

    function handleExport() {
      tableRef.value.exportCSV();
    }

    const model = props.model

    function onDataTableEvent(event: any) {
      model.pageable.offset = event.first
      model.pageable.limit = event.rows
      if (event.sortField) {
        model.pageable.sort = event.sortField
        model.pageable.dir = event.sortOrder > 0 ? 'ASC' : 'DESC'
      } else {
        delete model.pageable.sort
        delete model.pageable.dir
      }
      model.load()
    }

    return {
      tableRef,
      onDataTableEvent,
      handleExport
    }
  }
})
</script>

<style scoped>

</style>