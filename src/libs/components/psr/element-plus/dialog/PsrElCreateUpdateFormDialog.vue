<template>
  <el-dialog :title="creating?'创建':'编辑'" :before-close="beforeClose" :model-value="visible">
    <el-form v-model="formData">
      <slot :formData="formData" :creating="creating"/>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <psr-el-async-action-button
            type="primary"
            :disabled="!formDirty"
            :action="handleSubmit"
        >保存</psr-el-async-action-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, toRaw, watch} from "vue";
import PsrElAsyncActionButton from "@/libs/components/psr/element-plus/buttons/PsrElAsyncActionButton.vue";
import {cloneDeep, isEqual} from "lodash";
import {ElMessage, ElMessageBox} from "element-plus";

export type CreateHandler<E> = (data: E) => Promise<E>
export type UpdateHandler<E> = (data: E) => Promise<E>

export default defineComponent({
  name: "PsrElCreateUpdateFormDialog",
  components: {
    PsrElAsyncActionButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idProperty: {
      type: String,
      required: true,
      default: 'id'
    },
    data: {
      type: Object,
      required: true
    },
    defaultData: {
      type: Function,
      required: true
    },
    handleCreate: {
      type: Function as PropType<CreateHandler<any>>,
      required: true
    },
    handleUpdate: {
      type: Function as PropType<UpdateHandler<any>>,
      required: true
    }
  },
  emits: ['update:visible', 'update:data', 'dataChanged'],
  setup(props, context) {
    const originalData = ref<any>({})
    const formData = ref<any>({})
    const creating = computed(() => !originalData.value[props.idProperty])
    const formDirty = computed(() => {
      return !isEqual(formData.value, originalData.value)
    })

    watch(() => props.data, data => {
      if (data) {
        originalData.value = cloneDeep(toRaw(props.data))
        formData.value = cloneDeep(toRaw(props.data))
      } else {
        context.emit('update:data', props.defaultData())
      }
    }, {immediate: true})

    function hide() {
      context.emit('update:visible', false)
      context.emit('update:data', {})
    }

    function handleChanged(data: any) {
      ElMessage({
        message: '保存成功.',
        type: 'success',
      })
      context.emit('dataChanged')
      context.emit('update:data', data)
    }

    function handleSubmit() {
      if (creating.value) {
        return props.handleCreate(formData.value).then(handleChanged)
      } else {
        return props.handleUpdate(formData.value).then(handleChanged)
      }
    }

    function beforeClose() {
      if (formDirty.value) {
        ElMessageBox.confirm(
            '是否保存修改',
            '确认保存', {
              distinguishCancelAndClose: true,
              confirmButtonText: '保存',
              cancelButtonText: '不保存',
            }
        ).then(() => {
          handleSubmit().then(hide)
        }).catch(action => {
          if (action === 'cancel') {
            hide()
          }
        })
      } else {
        hide()
      }
    }

    return {
      formData,
      formDirty,
      creating,
      handleSubmit,
      beforeClose
    }
  }
})
</script>

<style scoped>

</style>