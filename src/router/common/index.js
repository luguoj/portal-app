import Blank from "@/views/blank/Blank";
import ErrorNotFound from "@/views/error/ErrorNotFound";

export default [{
    name: 'blank',
    path: '/',
    component: Blank
}, {
    name: 'error-not-found',
    path: '/:pathMatch(.*)*',
    component: ErrorNotFound
}]