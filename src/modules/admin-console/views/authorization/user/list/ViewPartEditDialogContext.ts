import {ref} from "vue";
import {UserEntity} from "@/services/authorization/CRUDService";

export class ViewPartEditDialogContext {
    data = ref({})
    visible = ref(false)

    show(row?: UserEntity) {
        this.visible.value = true
        this.data.value = row || {}
    }
}