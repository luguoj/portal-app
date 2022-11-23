import {PsrLayoutDesktopConsoleOptions} from "@/libs/layouts/psr/desktop-console/options";
import {SamplePage} from "@/modules/sample-page";
import PsrErrorNotFound from "@/libs/components/psr/views/PsrErrorNotFound.vue";
import PsrOAuthSSOClientSignIn from "@/libs/components/psr/views/PsrOAuthSSOClientSignIn.vue";
import {createAppContext} from "@/libs/commons/psr/app-context";
import {platformClient} from "@/config/psr-app-context/platformClient";
import {routeCache} from "./routeCache";
import {App} from "vue";
import {widgets} from "@/config/psr-app-context/widget";
import {personalService} from "@/services/personalService";
import {permissionService} from "@/services/permissionService";
import {userProfileService} from "@/services/userProfileService";
import {PlatformConsoleLayout} from "@/layouts/platform-console";

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
    }, PlatformConsoleLayout],
    permissionService,
    userProfileService,
    pages: {
        signIn: PsrOAuthSSOClientSignIn,
        errorNotFound: PsrErrorNotFound
    },
    widgets,
    personalService
}).use(routeCache).usePlatformClient(platformClient)

export function applyPsrAppContext(app: App) {
    app.use(appContext)
}