<template>
  <el-container style="height:100%;" v-loading="dataTable && dataTable.loading">
    <el-header class="fit">
      <header-bar
          v-model:application="application"
          v-model:domain-type="domainType"
          v-model:selected-field-names="selectedFieldNames"
          :field-schemas="fieldSchemas"
          @find="dataTable.load(0)"
          @clear-filters="dataTable.clearFilters()"
          @add="editDialog.show()"
      />
    </el-header>
    <el-main style="padding: 0;">
      <data-table
          v-if="dataTable"
          :application="application"
          :domain-type="domainType"
          :field-schemas="selectedFieldSchemas"
          :model="dataTable"
          @edit="editDialog.show($event)"
          @data-changed="dataTable.load(0)"
      />
    </el-main>
  </el-container>
  <edit-dialog
      v-if="editDialog"
      :field-schemas="fieldSchemas"
      :model="editDialog"
      @data-changed="dataTable.load(0)"
  />
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import HeaderBar from "./components/header-bar.vue";
import DataTable from "./components/data-table.vue";
import EditDialog from "./components/edit-dialog.vue"
import {PsrFilterPagingDataTableModel} from "@/libs/components/psr/widgets/data-table/filter-paging/PsrFilterPagingDataTableModel";
import {FilterMatchMode} from "primevue/api";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {CommonEntity, DomainSchema, entityService} from "@/services/entity";
import {checkFieldType} from "@/modules/admin-console/views/entity/checkFieldType";

export default defineComponent({
  name: "admin-console-entity",
  components: {
    HeaderBar,
    DataTable,
    EditDialog
  },
  setup() {
    const application = ref('')
    const domainType = ref('')
    const fieldSchemas = ref<DomainSchema[]>([])
    const selectedFieldNames = ref<string[]>([])
    const selectedFieldSchemas = computed(() => {
      return fieldSchemas.value.filter(schema => {
        return selectedFieldNames.value.indexOf(schema.name) >= 0
      })
    })
    const dataTable = ref<PsrFilterPagingDataTableModel<CommonEntity>>();
    const editDialog = ref<PsrCreateUpdateFormDialogModel<CommonEntity>>();
    watch(domainType, () => {
      fieldSchemas.value = []
      selectedFieldNames.value = []
      dataTable.value = undefined
      editDialog.value = undefined
      if (application.value && domainType.value) {
        entityService.schema.findSchemaByDomainType(application.value, domainType.value).then(schemas => {
          fieldSchemas.value = schemas
          selectedFieldNames.value = schemas.map(schema => schema.name).filter(name => {
            return name !== 'id' && name !== 'version' && name !== 'createdDate' && name !== 'lastModifiedDate'
          })
          dataTable.value = PsrFilterPagingDataTableModel.create<CommonEntity>({
            loadDataHandler: (filter, pageable) => {
              return entityService.crud.findAll(application.value, domainType.value, filter, pageable)
            },
            defaultFilters: () => {
              const filter: Record<string, any> = {}
              for (const schema of schemas) {
                const type = checkFieldType(schema)
                switch (type) {
                  case 'boolean':
                  case 'number':
                    filter[schema.name] = {value: undefined, matchMode: FilterMatchMode.EQUALS}
                    break
                  case 'string':
                    filter[schema.name] = {value: null, matchMode: FilterMatchMode.CONTAINS}
                    break
                  case 'date':
                    filter[schema.name] = {value: null, matchMode: FilterMatchMode.DATE_IS}
                }
              }
              return filter
            }
          })
          editDialog.value = PsrCreateUpdateFormDialogModel.create<CommonEntity>({
            defaultData: () => {
              const data: Record<string, any> = {}
              for (const schema of schemas) {
                const type = checkFieldType(schema)
                switch (type) {
                  case 'boolean':
                    data[schema.name] = false
                    break
                  case 'number':
                    data[schema.name] = 0
                    break
                  case 'string':
                    data[schema.name] = ''
                    break
                  case 'date':
                    data[schema.name] = null
                }
              }
              return data
            },
            createHandler: (data: CommonEntity) => {
              return entityService.crud.create(
                  application.value, domainType.value,
                  {
                    ...data
                  })
            },
            updateHandler: (data: CommonEntity) => {
              const ignoreFields = ['id', 'version', 'createdDate', 'lastModifiedDate']
              const fields: string[] = schemas.map(schema => schema.name).filter(field => {
                return ignoreFields.indexOf(field) < 0
              })
              return entityService.crud.patch(
                  application.value, domainType.value,
                  fields,
                  data
              )
            }
          })
        })
      }
    })
    return {
      application,
      domainType,
      fieldSchemas,
      selectedFieldNames,
      selectedFieldSchemas,
      dataTable,
      editDialog
    }
  }
})
</script>

<style lang="scss" scoped>

</style>