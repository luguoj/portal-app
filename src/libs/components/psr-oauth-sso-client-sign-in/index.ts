import {AppModuleConfig} from "psr-app-context/";
import {routes} from "./route";

export const PSR_LAYOUT_MODULE_NAME = 'psr-oauth-sso-client-sign-in'
export const PsrOAuthSSOClientSignIn: AppModuleConfig = {
    name: PSR_LAYOUT_MODULE_NAME,
    routes,
}