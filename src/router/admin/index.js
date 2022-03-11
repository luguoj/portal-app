import AdminPermission from "@/views/admin/permission/AdminPermission";
import AdminUser from "@/views/admin/user/AdminUser";
import AdminGroup from "@/views/admin/group/AdminGroup";
import AdminGroupList from "@/views/admin/group/AdminGroupList";
import AdminGroupAuthority from "@/views/admin/group/AdminGroupAuthority";
import AdminGroupUser from "@/views/admin/group/AdminGroupUser";

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
    component: AdminGroup,
    redirect: '',
    children: [{
        name: 'admin-group-list',
        path: '',
        component: AdminGroupList
    }, {
        name: 'admin-group-authority',
        path: ':groupId/authority',
        component: AdminGroupAuthority,
        props: true
    }, {
        name: 'admin-group-user',
        path: ':groupId/user',
        component: AdminGroupUser,
        props: true
    }]
}