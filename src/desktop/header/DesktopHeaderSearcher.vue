<template>
  <el-select
      ref="refSelect"
      placeholder="搜索 (菜单名称 / 拼音 / 导航路径)"
      filterable
      remote
      :remote-method="querySearch"
      @change="searcherChange"
  >
    <el-option
        v-for="resultItem in searchResult" :key="resultItem.item.path"
        :label="resultItem.item.title"
        :value="resultItem.item.path"
    />
  </el-select>
</template>

<script>
import {useRouter} from "vue-router";
import {ref,defineComponent} from "vue";
import Fuse from "fuse.js";
import pinyin from "pinyin";

export default defineComponent({
  name: "DesktopHeaderSearcher",
  setup() {
    const refSelect = ref()
    const router = useRouter()
    const allOptions = router.getRoutes()
        .filter(route => route.meta.menuItem)
        .map(route => {
          const titles = []
          titles.push(...route.meta.menuItem.allParents.map(parent => parent.title))
          titles.push(route.meta.menuItem.title)
          const title = titles.join(' / ')
          const titlePinyin = pinyin(title, {style: pinyin.STYLE_NORMAL}).join('')
          return {
            title,
            titlePinyin,
            path: route.path
          }
        })
    const fuse = new Fuse(allOptions, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [{
        name: 'title',
        weight: 0.5
      }, {
        name: 'titlePinyin',
        weight: 0.4
      }, {
        name: 'path',
        weight: 0.1
      }]
    })
    const searchResult = ref([])
    return {
      refSelect,
      searchResult,
      querySearch: (query) => {
        if (query !== '') {
          searchResult.value = fuse.search(query)
        } else {
          searchResult.value = []
        }
      },
      searcherChange: (val) => {
        router.push(val)
      },
      focus: () => {
        refSelect.value.focus()
      },
      clean: () => {
        refSelect.value.blur()
        searchResult.value = []
      }
    }
  }
})
</script>

<style scoped>

</style>