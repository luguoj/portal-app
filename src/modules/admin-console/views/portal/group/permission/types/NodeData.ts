import {GroupPermissionEntity} from "@/services/portal/types";
import {PsrAppPermissionUsage} from "@/libs/commons/psr/app-context";

export interface NodeData {
    id: string,
    nameRaw: string,
    title: string
    iconCls?: string
    permissionUsage: PsrAppPermissionUsage,
    permissionKey?: string,
    permissions?: string[],
    access: boolean,
    actions: string[],
    originAccess: boolean,
    originActions: string[],
    groupPermission: GroupPermissionEntity | null,
    children: NodeData[]
}