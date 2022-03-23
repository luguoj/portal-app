import {NOT_AUTHENTICATED, PSROAuthContext} from "@/modules/psr-oauth/context";
import {PSROAuthSSOClientTokenService} from "@/modules/psr-oauth";

export function useSignOutHandler(context: PSROAuthContext<PSROAuthSSOClientTokenService>) {
    return function () {
        return context.tokenService().signOut().then(() => {
            context.tokenInfo().access_token = ''
            context.tokenInfo().expires_at = null
            context.tokenInfo().token_type = null
            context.tokenInfo().authentication = {
                username: '',
                state: NOT_AUTHENTICATED
            }
        })
    }
}