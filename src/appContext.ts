import {createAppContext} from "@/libs/commons/app-context";
import {PsrLayout} from "@/libs/components/psr-layout";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";
import {PsrOAuthSSOClientSignIn} from "@/libs/components/psr-oauth-sso-client-sign-in";

export const appContext = createAppContext({
    modules: [
        PsrLayout,
        PsrOAuthSSOClientSignIn,
        SamplePage,
        Admin
    ]
})
