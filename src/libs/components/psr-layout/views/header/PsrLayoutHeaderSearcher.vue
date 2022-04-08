<template>
  <el-select
      ref="refSelect"
      placeholder="搜索 (菜单名称 / 拼音 / 拼音首字母)"
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

<script lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref, defineComponent, computed} from "vue";
import Fuse from "fuse.js";
import pinyin from "pinyin";
import {AppNavigationMenuItem, useAppNavigationMenu} from "psr-app-context/plugins/navigation-menu";
import {computeModuleRoutePath} from "psr-app-context/computeModuleRoute";

interface SelectOption {
  title: string,
  titlePinyin: string,
  titlePinyinHeader: string,
  path: string
}

function buildSelectOptions(selectOptions: SelectOption[], menuItems: AppNavigationMenuItem[], base?: SelectOption) {
  for (const menuItem of menuItems) {
    const title = (base ? `${base.title} / ` : '') + menuItem.title
    const titlePinyinByWord = pinyin(menuItem.title, {style: pinyin.STYLE_NORMAL})
    const titlePinyin = (base ? base.titlePinyin : '') + titlePinyinByWord.join('')
    const titlePinyinHeader = (base ? base.titlePinyinHeader : '') + titlePinyinByWord.map(word => word[0].substring(0, 1)).join('')
    if (menuItem.route != undefined) {
      const path = menuItem.route.path
      selectOptions.push({title, titlePinyin, titlePinyinHeader, path})
    } else if (menuItem.children.length > 0) {
      buildSelectOptions(selectOptions, menuItem.children, {title, titlePinyin, titlePinyinHeader, path: ""})
    }
  }
}

export default defineComponent({
  name: "psr-layout-header-searcher",
  setup() {
    const modulePathPrefix = computeModuleRoutePath("")
    const refSelect = ref()
    const menuItems = useAppNavigationMenu().menuItems
    const router = useRouter()
    const route = useRoute()
    const fuse = computed(() => {
      const selectOptions: SelectOption[] = []
      buildSelectOptions(selectOptions, menuItems.value[route.matched[0].name!])
      return new Fuse<SelectOption>(selectOptions, {
        shouldSort: true,
        threshold: 0.1,
        location: 0,
        distance: 100,
        minMatchCharLength: 1,
        keys: [{
          name: 'title',
          weight: 0.4
        }, {
          name: 'titlePinyin',
          weight: 0.3
        }, {
          name: 'titlePinyinHeader',
          weight: 0.3
        }]
      })
    })

    function querySearch(query: string) {
      if (query !== '') {
        searchResult.value = fuse.value.search(query)
      } else {
        searchResult.value = []
      }
    }

    const searchResult = ref([] as Fuse.FuseResult<SelectOption>[])
    return {
      refSelect,
      searchResult,
      querySearch,
      searcherChange: (val: string) => {
        router.push(modulePathPrefix + val)
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