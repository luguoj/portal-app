<template>
  <psr-create-update-form-dialog
      :model="model"
      @data-changed="$emit('dataChanged')"
  >
    <template #default="{formData,creating}">
      <el-form-item
          v-for="fieldDefinition in fieldDefinitions" :key="fieldDefinition.field"
          :label="fieldDefinition.label"
      >
        <el-input
            v-if="fieldDefinition.type==='string'"
            v-model="formData[fieldDefinition.field]"
            :disabled="!creating&&fieldDefinition.field==='id'"
        />
        <el-switch
            v-else-if="fieldDefinition.type==='boolean'"
            v-model="formData[fieldDefinition.field]"
        />
        <el-input-number
            v-else-if="fieldDefinition.type==='number'"
            v-model="formData[fieldDefinition.field]"
        />
        <el-date-picker
            v-else-if="fieldDefinition.type==='date'"
            v-model="formData[fieldDefinition.field]"
            type="datetime"
        />
      </el-form-item>
    </template>
  </psr-create-update-form-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import PsrCreateUpdateFormDialog from "@/libs/components/psr/dialogs/create-update-form/index.vue";
import {PsrCreateUpdateFormDialogModel} from "@/libs/components/psr/dialogs/create-update-form/PsrCreateUpdateFormDialogModel";
import {CommonEntity, DomainSchema} from "@/services/entity";
import {checkFieldType, FieldType} from "@/modules/admin-console/views/entity/checkFieldType";

interface FieldDefinition {
  label: string,
  field: string,
  type: FieldType
}

export default defineComponent({
  name: "edit-dialog",
  components: {
    PsrCreateUpdateFormDialog
  },
  props: {
    fieldSchemas: {
      type: Array as PropType<DomainSchema[]>
    },
    model: Object as PropType<PsrCreateUpdateFormDialogModel<CommonEntity>>
  },
  emits: ['dataChanged'],
  setup(props) {
    const ignoreFields = ['version', 'createdDate', 'lastModifiedDate']
    const fieldDefinitions = computed<FieldDefinition[]>(() => {
      const _fieldDefinitions: FieldDefinition[] = []
      if (props.fieldSchemas && props.fieldSchemas.length > 0) {
        for (const fieldSchema of props.fieldSchemas) {
          if (ignoreFields.indexOf(fieldSchema.name) < 0) {
            const type = checkFieldType(fieldSchema)
            _fieldDefinitions.push({
              field: fieldSchema.name,
              label: fieldSchema.description,
              type
            })
          }
        }
      }
      return _fieldDefinitions
    })
    return {
      fieldDefinitions
    }
  }
})
</script>

<style scoped>

</style>