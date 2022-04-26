<template>
  <el-dialog :title="creating?'创建':'编辑'" :before-close="beforeClose" :model-value="visible">
    <el-form v-model="formData">
      <el-form-item label="用户名">
        <el-input v-model="formData.id" :disabled="!creating"/>
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

<script lang="ts">
import {computed, defineComponent, PropType, ref, toRaw, watch} from "vue";
import {UserEntity} from "@/services/authorization/CRUDService";
import PsrElAsyncActionButton from "@/libs/components/psr/element-plus/buttons/PsrElAsyncActionButton.vue";
import {GroupEntity} from "@/services/portal/CRUDService";
import {cloneDeep, isEqual} from "lodash";
import {ElMessage, ElMessageBox} from "element-plus";
import {authorizationService} from "@/services/authorization";

function defaultData(): UserEntity {
  return {
    id: '',
    version: 0,
    enabled: false
  }
}

export default defineComponent({
  name: "ViewPartEditDialog",
  components: {PsrElAsyncActionButton},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object as PropType<UserEntity>,
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
        return authorizationService.crud.user.create({
          ...formData.value
        }).then(handleChanged)
      } else {
        return authorizationService.crud.user.patch(
            ['enabled'],
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

</style>