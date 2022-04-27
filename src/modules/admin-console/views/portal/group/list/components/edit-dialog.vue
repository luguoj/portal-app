<template>
  <el-dialog :title="creating?'创建':'编辑'" :before-close="beforeClose" :model-value="visible">
    <el-form v-model="formData">
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
import {ElForm, ElMessage, ElMessageBox} from "element-plus";
import {defineComponent, computed, ref, toRaw, watch, PropType} from "vue";
import {cloneDeep, isEqual} from "lodash";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import {portalService} from "@/services/portal";
import {GroupEntity} from "@/services/portal/CRUDService";

if (typeof process.env.VUE_APP_PORTAL_ID !== 'string') {
  throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const portalId: string = process.env.VUE_APP_PORTAL_ID

function defaultData(): GroupEntity {
  return {
    id: '',
    version: 0,
    code: '',
    description: '',
    enabled: false
  }
}

export default defineComponent({
  name: "edit-dialog",
  components: {
    PsrAsyncActionButton
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object as PropType<GroupEntity>,
      required: true,
      default: defaultData
    }
  },
  emits: ['update:visible', 'update:data', 'dataChanged'],
  setup(props, context) {
    const originalData = ref<GroupEntity>({})
    const formData = ref<GroupEntity>({})
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
      context.emit('update:data', {})
    }

    function handleChanged(data: GroupEntity) {
      ElMessage({
        message: '保存成功.',
        type: 'success',
      })
      context.emit('dataChanged')
      context.emit('update:data', data)
    }

    function handleSubmit() {
      if (creating.value) {
        return portalService.crud.group.create({
          portalId,
          ...formData.value
        }).then(handleChanged)
      } else {
        return portalService.crud.group.patch(
            ['code', 'description', 'enabled'],
            formData.value
        ).then(handleChanged)
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
.dialog-footer {

}
</style>