import {ModuleConfig} from "@/libs/commons/module-config";
import {routes} from "./route";

export const PSR_LAYOUT_MODULE_NAME = 'psr-oauth-sso-client-sign-in'
export const PsrOAuthSSOClientSignIn: ModuleConfig = {
    name: PSR_LAYOUT_MODULE_NAME,
    routes,
}