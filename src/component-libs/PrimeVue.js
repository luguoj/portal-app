import PrimeVue from "primevue/config";
import 'primevue/resources/primevue.min.css'
import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import './prime-vue/custom.scss'

export function usePrimeVue(app) {
    app.use(PrimeVue)
}