import {PsrAppLayoutOptions} from "./PsrAppLayoutOptions";
import {Plugin as StorePlugin} from "vuex";
import {PsrAppPageOptions} from "./PsrAppPageOptions";
import {PsrAppPermissionService} from "../permission";
import {PSROAuthContext} from "@/libs/services/psr-oauth/context";

export interface PsrAppContextOptions {
    layouts: PsrAppLayoutOptions[]
    permission: PsrAppPermissionService
    token?: PSROAuthContext<TokenService>
    storePlugins?: StorePlugin<any>[],
    pages: PsrAppPageOptions
}