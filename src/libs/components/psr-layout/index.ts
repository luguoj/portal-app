import {store} from "@/libs/components/psr-layout/store";
import {routes} from "@/libs/components/psr-layout/route";
import {ModuleConfig} from "@/libs/commons/module-config";

export const PsrLayout: ModuleConfig = {
    name: 'layout',
    store: store,
    routes: routes
}