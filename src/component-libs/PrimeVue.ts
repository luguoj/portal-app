import PrimeVue from "primevue/config";
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './prime-vue/custom.scss'
import {App} from "@vue/runtime-core";

export function usePrimeVue(app: App): void {
    app.use(PrimeVue)
}