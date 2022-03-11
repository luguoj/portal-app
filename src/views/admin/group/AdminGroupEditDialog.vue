<template>
  <el-dialog :title="creating?'创建':'编辑'" :before-close="beforeClose" v-model="visible">
    <el-form ref="formRef" v-model="formData">
      <el-form-item label="编码">
        <el-input v-model="formData.code"/>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="formData.description"/>
      </el-form-item>
      <el-form-item label="激活">
        <el-switch v-model="formData.enabled"/>
      </el-form-item>
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

<script>
import {ElMessage, ElMessageBox} from "element-plus";
import {computed, ref, toRaw, watch} from "vue";
import {cloneDeep, isEqual} from "lodash";
import {portalEntityCRUDService} from "@/services/portal";
import PsrElAsyncActionButton from "@/components/psr-element-plus/buttons/PsrElAsyncActionButton";

function defaultData() {
  return {
    id: '',
    version: 0,
    code: '',
    description: '',
    enabled: false
  }
}

export default {
  name: "AdminGroupEditDialog",
  components: {PsrElAsyncActionButton},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  emits: ['update:visible', 'update:data', 'dataChanged'],
  setup(props, context) {
    const formRef = ref()
    const originalData = ref()
    const formData = ref()
    const creating = computed(() => !props.data || !props.data.id)
    const formDirty = computed(() => {
      return !isEqual(formData.value, originalData.value)
    })

    watch(() => props.data, data => {
      if (data) {
        originalData.value = cloneDeep(toRaw(props.data))
        formData.value = cloneDeep(toRaw(props.data))
      } else {
        originalData.value = cloneDeep(defaultData())
        formData.value = cloneDeep(defaultData())
      }
    }, {immediate: true})


    function hide() {
      context.emit('update:visible', false)
      context.emit('update:data', null)
    }

    function handleChanged(data) {
      ElMessage({
        message: '保存成功.',
        type: 'success',
      })
      context.emit('dataChanged')
      context.emit('update:data', data)
    }

    function handleSubmit() {
      if (creating.value === true) {
        return portalEntityCRUDService.group.create({
          data: {
            portalId: process.env.VUE_APP_PORTAL_ID,
            ...formData.value
          }
        }).then(handleChanged)
      } else {
        return portalEntityCRUDService.group.patch({
          fields: ['code', 'description', 'enabled'],
          data: {
            ...formData.value
          }
        }).then(handleChanged)
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
      formRef,
      formData,
      formDirty,
      creating,
      handleSubmit,
      beforeClose
    }
  }
}
</script>

<style scoped>
.dialog-footer {

}
</style>