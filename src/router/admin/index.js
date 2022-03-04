import AdminPermission from "@/views/admin/permission/AdminPermission";
import AdminUser from "@/views/admin/user/AdminUser";
import AdminGroup from "@/views/admin/group/AdminGroup";

export const ADMIN_PERMISSION = {
    name: 'admin-permission',
    path: '/admin/permission',
    component: AdminPermission
}
export const ADMIN_USER = {
    name: 'admin-user',
    path: '/admin/user',
    component: AdminUser
}
export const ADMIN_GROUP = {
    name: 'admin-group',
    path: '/admin/group',
    component: AdminGroup
}