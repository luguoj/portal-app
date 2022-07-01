<template>
  <el-upload
      ref="uploadRef"
      :auto-upload="false"
      style="height: fit-content;width: fit-content;"
      :on-change="onChange"
      :show-file-list="false"
      :accept="accept"
  >
    <template #trigger>
      <slot v-if="custom"/>
      <el-button v-else>
        <template #icon>
          <slot name="icon"/>
        </template>
        <slot/>
      </el-button>
    </template>
  </el-upload>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {useFileReader} from "@/libs/commons/psr/utils/useFileReader";
import {UploadFile} from "element-plus/es";

export default defineComponent({
  name: "psr-read-file-button",
  props: {
    custom: {
      type: Boolean,
      default: false
    },
    accept: {type: String, default: '.txt'},
    contentType: {
      type: String,
      default: 'text'
    }
  },
  emits: ['load'],
  setup(props, context) {
    const uploadRef = ref()

    const {readAsText, readAsArrayBuffer} = useFileReader(result => {
      context.emit('load', result)
    })

    return {
      uploadRef,
      onChange: function (uploadFile: UploadFile) {
        if (uploadFile.raw) {
          if (props.contentType === 'text') {
            readAsText(uploadFile.raw);
          } else if (props.contentType === 'ArrayBuffer') {
            readAsArrayBuffer(uploadFile.raw)
          }
          uploadRef.value.clearFiles()
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>

</style>