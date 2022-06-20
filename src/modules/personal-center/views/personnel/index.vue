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
      <el-button type="primary" @click="handleSave(formRef)">保存</el-button>
      <el-button @click="handleReset(formRef)">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";
import {FormInstance, FormRules} from "element-plus";

interface FormModel {
  firstName: string,
  lastName: string,
  resume: string
}


export default defineComponent({
  name: "personal-center-personnel",
  components: {},
  setup() {
    const formRef = ref<FormInstance>()
    const rules = reactive<FormRules>({
      firstName: [{required: true, message: '请输入名字', trigger: 'blur'}],
      lastName: [{required: true, message: '请输入姓氏', trigger: 'blur',},],
      resume: [{required: false, message: '请输入简介', trigger: 'blur',},]
    })
    const handleSave = async (formEl: FormInstance | undefined) => {
      if (!formEl) return
      await formEl.validate((valid, fields) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!', fields)
        }
      })
    }
    const handleReset = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
    }
    const form = ref<FormModel>({
      firstName: "",
      lastName: "",
      resume: ""
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