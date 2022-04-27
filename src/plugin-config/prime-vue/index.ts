import PrimeVue from "primevue/config";
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './custom.scss'
import {App} from "@vue/runtime-core";

export function applyPrimeVue(app: App): void {
    app.use(PrimeVue)
}