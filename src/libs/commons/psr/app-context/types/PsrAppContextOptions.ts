import {PsrAppLayoutOptions} from "./PsrAppLayoutOptions";
import {Plugin as StorePlugin} from "vuex";
import {PsrAppPageOptions} from "./PsrAppPageOptions";
import {PsrAppPermissionService} from "../permission";
import {PsrAppUserProfileService} from "../store";
import {PsrAppWidgetCatalogRaw} from "@/libs/commons/psr/app-context/widget-manager/types/PsrAppWidgetRaw";
import {PsrAppPersonalService} from "../personal";

export interface PsrAppContextOptions {
    layouts: PsrAppLayoutOptions[]
    permissionService: PsrAppPermissionService,
    userProfileService?: PsrAppUserProfileService,
    storePlugins?: StorePlugin<any>[],
    pages: PsrAppPageOptions,
    widgets: PsrAppWidgetCatalogRaw[],
    personalService?: PsrAppPersonalService
}