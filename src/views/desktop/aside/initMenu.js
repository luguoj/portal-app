import {ref} from "vue";
import axios from "axios";
import {useRoute} from "vue-router";
import {nextTick, onMounted, watch, watchEffect} from "vue";
import {tokenService} from "@/services/Authorization";
import {AUTHENTICATED} from "@/modules/psr-oauth/context";

export function initMenu() {
    const activeMenuId = ref(null)
    const menuItems = ref([])
    const menuItemById = {}

    function clearNavigationItems() {
        menuItems.value = []
    }

    function refreshNavigationItems() {
        return axios.get('./navigationItem.json')
            .then((resp) => {
                if (resp && resp.data) {
                    for (const datum of resp.data) {
                        menuItemById[datum.id] = datum
                    }
                    const rootNavigationItems = []
                    for (const datum of resp.data) {
                        if (datum.parentId) {
                            menuItemById[datum.parentId].children = menuItemById[datum.parentId].children || []
                            menuItemById[datum.parentId].children.push(datum)
                        } else {
                            rootNavigationItems.push(datum)
                        }
                    }
                    menuItems.value = rootNavigationItems
                }
            })
    }

    const route = useRoute()
    let currentUsername = null
    onMounted(() => {
        watch(() => route.fullPath, fullPath => {
            activeMenuId.value = fullPath
        })
        watchEffect(() => {
            const username = tokenService.context().tokenInfo().username
            if (username) {
                if (username !== currentUsername
                    && tokenService.context().tokenInfo().authenticateState === AUTHENTICATED) {
                    refreshNavigationItems().then(() => {
                        activeMenuId.value = null
                        nextTick(() => activeMenuId.value = route.fullPath)
                    })
                    currentUsername = username
                }
            } else {
                clearNavigationItems()
                currentUsername = username
            }
        })
    })
    return {
        menuItems,
        activeMenuId
    }
}