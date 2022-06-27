<template>
  <el-dialog
      :title="creating?'创建':'编辑'"
      :before-close="beforeClose"
      :model-value="model.visible">
    <el-form :model="formData">
      <slot :formData="formData" :creating="creating"/>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <psr-async-action-button
            type="primary"
            :disabled="!formDirty"
            :action="handleSubmit"
        >保存</psr-async-action-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {computed, defineComponent, PropType, ref, toRaw, watch} from "vue";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import {isEqual} from "lodash";
import {ElMessage, ElMessageBox} from "element-plus";
import {PsrCreateUpdateFormDialogModel} from "./PsrCreateUpdateFormDialogModel";

export default defineComponent({
  name: "psr-create-update-form-dialog",
  components: {
    PsrAsyncActionButton
  },
  props: {
    model: {
      type: Object as PropType<PsrCreateUpdateFormDialogModel<any>>,
      required: true
    }
  },
  emits: ['dataChanged'],
  setup(props, context) {
    const originalData = ref<any>({})
    const formData = ref<any>({})
    const creating = computed(() => !originalData.value[props.model.idProperty])
    const formDirty = computed(() => {
      return !isEqual(formData.value, originalData.value)
    })

    watch(() => props.model.data, data => {
      const dataRaw = toRaw(data)
      for (const dataRawKey in dataRaw) {
        originalData.value[dataRawKey] = dataRaw[dataRawKey]
        formData.value[dataRawKey] = dataRaw[dataRawKey]
      }
    }, {immediate: true})

    function hide() {
      props.model.visible = false
      props.model.data = props.model.defaultData()
    }

    function handleChanged(data: any) {
      ElMessage({
        message: '保存成功.',
        type: 'success',
      })
      props.model.data = data
      context.emit('dataChanged')
    }

    function handleSubmit() {
      if (creating.value) {
        return props.model.createHandler(formData.value).then(handleChanged)
      } else {
        return props.model.updateHandler(formData.value).then(handleChanged)
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