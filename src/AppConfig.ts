import {AppConfigModule} from "@/libs/commons/app-config";
import {PsrLayout} from "@/libs/components/psr-layout";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";

export const Modules: AppConfigModule[] = [
    PsrLayout,
    SamplePage,
    Admin
]