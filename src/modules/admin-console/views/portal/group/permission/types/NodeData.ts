import {GroupPermissionEntity} from "@/services/portal/types";

export interface NodeData {
    id: string,
    title: string
    iconCls?: string
    permissionKey?: string,
    permissions?: string[],
    access: boolean,
    actions: string[],
    originAccess: boolean,
    originActions: string[],
    groupPermission: GroupPermissionEntity | null,
    children: NodeData[]
}