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
import {useRouter} from "vue-router";
import {computed, defineComponent, ref} from "vue";
import Fuse from "fuse.js";
import pinyin from "pinyin";
import {PsrAppNavigationMenuItem} from "@/libs/commons/psr/app-context/navigation-menu";
import {useAppContext} from "@/libs/commons/psr/app-context";

interface SelectOption {
  title: string,
  titlePinyin: string,
  titlePinyinHeader: string,
  path: string
}

function buildSelectOptions(selectOptions: SelectOption[], menuItems: PsrAppNavigationMenuItem[], base?: SelectOption) {
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
  name: "menu-searcher",
  setup() {
    const refSelect = ref()
    const menuItems = useAppContext().navigationMenu.currentLayoutMenuItems
    const router = useRouter()
    const fuse = computed(() => {
      const selectOptions: SelectOption[] = []
      if (menuItems.value) {
        for (const menuUsage in menuItems.value) {
          buildSelectOptions(selectOptions, menuItems.value[menuUsage])
        }
      }
      return new Fuse<SelectOption>(selectOptions, {
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