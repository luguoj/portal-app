import {PSROAuthSSOClientTokenService} from "@/modules/psr-oauth";

export const tokenService = new PSROAuthSSOClientTokenService(process.env.VUE_APP_PSR_AUTH_CLIENT_URL)
export const tokenContext = tokenService.context()
export const tokenInfo = tokenContext.tokenInfo()