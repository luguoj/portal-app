import {onMounted, ref} from "vue";
import axios from "axios";

export function loadNavigationItems() {
    const navigationItems = ref([])
    onMounted(() => {
        axios.get('./navigationItem.json')
            .then((resp) => {
                setTimeout(
                    ()=>{
                        if (resp && resp.data) {
                            const navigationItemMapById = {}
                            for (const datum of resp.data) {
                                navigationItemMapById[datum.id] = datum
                            }
                            const rootNavigationItems = []
                            for (const datum of resp.data) {
                                if (datum.parentId) {
                                    navigationItemMapById[datum.parentId].children = navigationItemMapById[datum.parentId].children || []
                                    navigationItemMapById[datum.parentId].children.push(datum)
                                } else {
                                    rootNavigationItems.push(datum)
                                }
                            }
                            navigationItems.value = rootNavigationItems
                        }
                    },
                    10000
                )

            })
    })
    return navigationItems
}