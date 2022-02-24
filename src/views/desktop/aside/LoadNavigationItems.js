import {ref} from "vue";
import axios from "axios";

export const navigationItems = ref([])
export const navigationItemById = {}

export function refreshNavigationItems() {
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