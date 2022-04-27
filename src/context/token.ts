import {createTokenContext} from "@/libs/commons/psr/app-context/plugins/token";
import {PsrOAuthSSOClientTokenService} from "@/libs/services/psr-oauth";

if (process.env.VUE_APP_PSR_AUTH_CLIENT_URL === undefined) {
    throw Error("缺少环境变量: process.env.VUE_APP_PSR_AUTH_CLIENT_URL")
}
const tokenService = new PsrOAuthSSOClientTokenService(process.env.VUE_APP_PSR_AUTH_CLIENT_URL)

export const tokenContext = createTokenContext({tokenService})