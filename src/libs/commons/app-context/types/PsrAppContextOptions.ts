import {PsrAppLayoutOptions} from "./PsrAppLayoutOptions";
import {Plugin as StorePlugin} from "vuex";
import {PsrAppPageOptions} from "./PsrAppPageOptions";
import {PsrAppPermissionService} from "../permission";

export interface PsrAppContextOptions {
    layouts: PsrAppLayoutOptions[]
    permission: PsrAppPermissionService
    storePlugins?: StorePlugin<any>[],
    pages: PsrAppPageOptions
}