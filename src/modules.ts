import {ModuleConfig} from "@/libs/commons/module-config";
import {PsrLayout} from "@/libs/components/psr-layout";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";
import {PsrOAuthSSOClientSignIn} from "@/libs/components/psr-oauth-sso-client-sign-in";

export const Modules: ModuleConfig[] = [
    PsrLayout,
    PsrOAuthSSOClientSignIn,
    SamplePage,
    Admin
]