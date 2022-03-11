import AdminPermission from "@/views/admin/permission/AdminPermission";
import AdminUser from "@/views/admin/user/AdminUser";
import AdminGroup from "@/views/admin/group/AdminGroup";
import AdminGroupList from "@/views/admin/group/AdminGroupList";
import AdminGroupPermission from "@/views/admin/group/AdminGroupPermission";
import AdminGroupUser from "@/views/admin/group/AdminGroupUser";

export const ROUTE_NAME_ADMIN = {
    GROUP: 'admin-group',
    GROUP_LIST: 'admin-group-list',
    GROUP_PERMISSION: 'admin-group-permission',
    GROUP_USER: 'admin-group-user'
}

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
    name: ROUTE_NAME_ADMIN.GROUP,
    path: '/admin/group',
    component: AdminGroup,
    redirect: '',
    children: [{
        name: ROUTE_NAME_ADMIN.GROUP_LIST,
        path: '',
        component: AdminGroupList,
        meta: {
            title: '分组清单'
        }
    }, {
        name: ROUTE_NAME_ADMIN.GROUP_PERMISSION,
        path: ':groupId/permission',
        component: AdminGroupPermission,
        props: true,
        meta: {
            title: '分组许可'
        }
    }, {
        name: ROUTE_NAME_ADMIN.GROUP_USER,
        path: ':groupId/user',
        component: AdminGroupUser,
        props: true,
        meta: {
            title: '分组用户'
        }
    }]
}