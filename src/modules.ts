import {ModuleConfig} from "@/libs/commons/module-config";
import {PsrLayout} from "@/libs/components/psr-layout";
import {SamplePage} from "@/modules/sample-page";
import {Admin} from "@/modules/admin-console";

export const Modules: ModuleConfig[] = [
    PsrLayout,
    SamplePage,
    Admin
]