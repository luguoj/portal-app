import {createAppContext, DenyAll, PermitAll} from "@/libs/commons/app-context/";
import {PsrLayoutDesktopConsole} from "@/libs/components/psr/layouts/desktop-console";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";
import {portalService} from "@/services/portal";
import {createAppRouteCache} from "@/libs/commons/app-context/plugins/route-cache/PsrAppRouteCacheProvider";
import {createStatePersistPlugin} from "@/libs/commons/store/plugins/state-persist";
import PsrErrorNotFound from "@/libs/components/psr/views/PsrErrorNotFound.vue";
import PsrOAuthSSOClientSignIn from "@/libs/components/psr/views/PsrOAuthSSOClientSignIn.vue";

if (process.env.VUE_APP_PORTAL_ID === undefined) {
    throw new Error("缺少环境变量: process.env.VUE_APP_PORTAL_ID")
}
const appPortalId: string = process.env.VUE_APP_PORTAL_ID

export const appContext = createAppContext({
    layouts: [{
        ...PsrLayoutDesktopConsole,
        name: 'layout-desktop-sample',
        title: '样例门户',
        iconCls: 'pi pi-book',
        modules: [
            SamplePage
        ],
        permission: true
    }, {
        ...PsrLayoutDesktopConsole,
        name: 'layout-desktop-admin',
        title: '管理员桌面',
        iconCls: 'pi pi-cog',
        modules: [
            Admin
        ],
        permission: true
    }],
    permission: (username: string) => {
        if (username === '') {
            return Promise.resolve(DenyAll)
        } else if (username === 'platform_admin') {
            return Promise.resolve(PermitAll)
        } else {
            return portalService.user.findPermissionByPortalId(appPortalId)
        }
    },
    storePlugins: [createStatePersistPlugin()],
    pages: {
        signIn: PsrOAuthSSOClientSignIn,
        errorNotFound: PsrErrorNotFound
    }
}).use(createAppRouteCache())
