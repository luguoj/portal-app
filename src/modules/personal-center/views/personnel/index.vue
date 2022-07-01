<template>
  <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      status-icon
  >
    <el-form-item label="姓名" required>
      <el-col :span="11">
        <el-form-item prop="lastName">
          <el-input
              v-model="form.lastName"
              placeholder="姓氏"
              style="width: 100%"
          />
        </el-form-item>
      </el-col>
      <el-col :span="2" class="psr-text-center">
        <span>-</span>
      </el-col>
      <el-col :span="11">
        <el-form-item prop="firstName">
          <el-input
              v-model="form.firstName"
              placeholder="名字"
              style="width: 100%"
          />
        </el-form-item>
      </el-col>
    </el-form-item>
    <el-form-item label="简介" prop="resume">
      <el-input v-model="form.resume" type="textarea"/>
    </el-form-item>
    <el-form-item>
      <psr-async-action-button type="primary" :action="handleSave">保存</psr-async-action-button>
      <psr-async-action-button :action="handleReset">重置</psr-async-action-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";
import {organizationService} from "@/services/organization";
import PsrAsyncActionButton from "@/libs/components/psr/widgets/button/async-action/index.vue";
import {ElMessage} from "element-plus/es";

interface FormModel {
  firstName: string,
  lastName: string,
  resume: string
}


export default defineComponent({
  name: "personal-center-personnel",
  components: {
    PsrAsyncActionButton
  },
  setup() {
    const formRef = ref<FormInstance>()
    const rules = reactive<FormRules>({
      firstName: [{required: true, message: '请输入名字', trigger: 'blur'}],
      lastName: [{required: true, message: '请输入姓氏', trigger: 'blur',},],
      resume: [{required: false, message: '请输入简介', trigger: 'blur',},]
    })
    const load = () => {
      return organizationService.user.findPersonnel().then(userPersonnel => {
        form.value = {
          firstName: userPersonnel?.firstName || "",
          lastName: userPersonnel?.lastName || "",
          resume: userPersonnel?.resume || ""
        }
      })
    }
    const handleSave = () => {
      const formEl = formRef.value
      if (!formEl) return Promise.reject()
      return new Promise(resolve => {
        formEl.validate((valid, fields) => {
          if (valid) {
            return organizationService.user.updatePersonnel(form.value).then(userPersonnel => {
              form.value = {
                firstName: userPersonnel?.firstName || "",
                lastName: userPersonnel?.lastName || "",
                resume: userPersonnel?.resume || ""
              }
              resolve(true)
              ElMessage({
                showClose: true,
                message: '保存成功.',
                type: 'success'
              })
            })
          }
        })
      })
    }
    const handleReset = () => {
      return load()
    }
    const form = ref<FormModel>({
      firstName: "",
      lastName: "",
      resume: ""
    })
    onMounted(() => {
      load()
    })
    return {
      formRef,
      rules,
      handleSave,
      handleReset,
      form
    }
  }
})
</script>

<style lang="scss" scoped>

</style>