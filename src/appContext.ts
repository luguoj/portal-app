import {createAppContext, DenyAll, PermitAll} from "@/libs/commons/app-context";
import {PsrLayout} from "@/libs/components/psr-layout";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";
import {PsrOAuthSSOClientSignIn} from "@/libs/components/psr-oauth-sso-client-sign-in";
import {portalService} from "@/services/portal";
import {createAppRouteCache} from "@/libs/commons/app-context/plugins/route-cache/AppRouteCacheProvider";

if (process.env.VUE_APP_PORTAL_ID === undefined) {
    throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const appPortalId: string = process.env.VUE_APP_PORTAL_ID

export const appContext = createAppContext({
    modules: [
        PsrLayout,
        PsrOAuthSSOClientSignIn,
        SamplePage,
        Admin
    ],
    permission: (username: string) => {
        if (username === '') {
            return Promise.resolve(DenyAll)
        } else if (username === 'platform_admin') {
            return Promise.resolve(PermitAll)
        } else {
            return portalService.user.findPermissionByPortalId(appPortalId)
        }
    }
}).use(createAppRouteCache())
