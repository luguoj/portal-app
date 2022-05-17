<template>
  <el-container>
    <el-aside>
      <el-container>
        <el-header>
          <el-button @click="add">add</el-button>
        </el-header>
        <el-main>
          <ul>
            <li v-for="item in listModel" @click="editorModel=item">{{ item.name }}</li>
          </ul>
        </el-main>
      </el-container>
    </el-aside>
    <el-main>
      <el-form :model="editorModel">
        <el-form-item label="name">
          <input v-model="editorModel.name"/>
<!--          <el-input v-model="editorModel.name"/>-->
        </el-form-item>
        <el-form-item label="age">
          <el-input v-model="editorModel.age"/>
        </el-form-item>
        <el-form-item label="sex">
          <el-input v-model="editorModel.sex"/>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import {defineComponent, reactive, ref} from "vue";

interface Person {
  name: string
  sex: string
  age: number
}

export default defineComponent({
  name: "SamplePage",
  components: {},
  setup() {
    const editorModel = ref<Person>({name: '', sex: '', age: 0})
    const listModel = reactive<Person[]>([])
    return {
      editorModel,
      listModel,
      add: () => {
        const person: Person = {name: 'new', sex: '', age: 0}
        editorModel.value = person
        listModel.push(person)
      }
    }
  }
})
</script>

<style scoped>

</style>