import {PSROAuthSSOClientTokenService} from "@/libs/services/psr-oauth";
import {PSROAuthContext} from "@/libs/services/psr-oauth/context";

if (process.env.VUE_APP_PSR_AUTH_CLIENT_URL === undefined) {
    throw Error("缺少环境变量: process.env.VUE_APP_PSR_AUTH_CLIENT_URL")
}
export const tokenService = new PSROAuthSSOClientTokenService(process.env.VUE_APP_PSR_AUTH_CLIENT_URL)
export const tokenContext = new PSROAuthContext(tokenService)
export const tokenInfo = tokenContext.tokenInfo()