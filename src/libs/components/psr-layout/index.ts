import {store} from "@/libs/components/psr-layout/store";
import {routes} from "@/libs/components/psr-layout/route";
import {AppConfigModule} from "@/libs/commons/app-config";

export const PsrLayout: AppConfigModule = {
    name: 'layout',
    store: store,
    routes: routes
}