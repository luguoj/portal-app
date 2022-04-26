import {reactive} from "vue";

export class PsrElCreateUpdateFormDialogContext<E> {
    data = {}
    visible = false

    show(row?: E) {
        this.visible = true
        this.data = row || {}
    }
}

export function createPsrElCreateUpdateFormDialogContext<E>() {
    return reactive(new PsrElCreateUpdateFormDialogContext<E>())
}