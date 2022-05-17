import {PsrLayoutDesktopConsoleOptions} from "@/libs/layouts/psr/desktop-console/options";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";
import {portalService} from "@/services/portal";
import PsrErrorNotFound from "@/libs/components/psr/views/PsrErrorNotFound.vue";
import PsrOAuthSSOClientSignIn from "@/libs/components/psr/views/PsrOAuthSSOClientSignIn.vue";
import {createAppContext} from "@/libs/commons/psr/app-context";
import {tokenContext} from "./token";
import {routeCache} from "./routeCache";
import {App} from "@vue/runtime-core";
import {widgets} from "@/plugin-config/psr-app-context/widget";

export const appContext = createAppContext({
    layouts: [{
        ...PsrLayoutDesktopConsoleOptions,
        name: 'layout-desktop-sample',
        title: '样例门户',
        iconCls: 'pi pi-book',
        modules: [
            SamplePage
        ],
        permissions: false
    }, {
        ...PsrLayoutDesktopConsoleOptions,
        name: 'layout-desktop-admin',
        title: '管理员桌面',
        iconCls: 'pi pi-cog',
        modules: [
            Admin
        ],
        permissions: []
    }],
    permission: (username: string) => {
        if (username === 'platform_admin') {
            return Promise.resolve('permit-all')
        } else {
            return portalService.user.findPermissionByPortalId()
        }
    },
    userProfileService: {
        find: () => {
            return portalService.user.findProfileByPortalId()
        },
        update: (content: any) => {
            return portalService.user.updateProfileByPortalId(content)
        }
    },
    pages: {
        signIn: PsrOAuthSSOClientSignIn,
        errorNotFound: PsrErrorNotFound
    },
    widgets
}).useToken(tokenContext).use(routeCache)

export function applyPsrAppContext(app: App) {
    app.use(appContext)
}