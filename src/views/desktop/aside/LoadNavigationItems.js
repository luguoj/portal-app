import {onMounted, ref} from "vue";
import axios from "axios";

const navigationItems = ref([])
const navigationItemById = {}

function refreshNavigationItems() {
    return axios.get('./navigationItem.json')
        .then((resp) => {
            if (resp && resp.data) {
                for (const datum of resp.data) {
                    navigationItemById[datum.id] = datum
                }
                const rootNavigationItems = []
                for (const datum of resp.data) {
                    if (datum.parentId) {
                        navigationItemById[datum.parentId].children = navigationItemById[datum.parentId].children || []
                        navigationItemById[datum.parentId].children.push(datum)
                    } else {
                        rootNavigationItems.push(datum)
                    }
                }
                navigationItems.value = rootNavigationItems
            }
        })
}

export function loadNavigationItems(cb) {
    onMounted(() => {
        refreshNavigationItems().then(cb)
    })
    return {
        navigationItems, navigationItemById, refreshNavigationItems
    }
}