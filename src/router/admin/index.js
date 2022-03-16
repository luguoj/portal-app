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

export const ROUTE_ADMIN_PERMISSION = {
    name: 'admin-permission',
    path: '/admin/permission',
    component: AdminPermission,
    meta: {
        title: '许可',
        iconCls: 'pi pi-key'
    }
}

export const ROUTE_ADMIN_USER = {
    name: 'admin-user',
    path: '/admin/user',
    component: AdminUser,
    meta: {
        title: '用户',
        iconCls: 'pi pi-users'
    }
}

export const ROUTE_ADMIN_GROUP = {
    name: ROUTE_NAME_ADMIN.GROUP,
    path: '/admin/group',
    component: AdminGroup,
    meta: {
        title: '分组',
        iconCls: 'pi pi-tag',
    },
    redirect: '',
    children: [{
        name: ROUTE_NAME_ADMIN.GROUP_LIST,
        path: '',
        component: AdminGroupList,
        meta: {
            title: '分组清单',
            requirePermission: true
        }
    }, {
        name: ROUTE_NAME_ADMIN.GROUP_PERMISSION,
        path: ':groupId/permission',
        component: AdminGroupPermission,
        props: true,
        meta: {
            title: '分组许可',
            requirePermission: true
        }
    }, {
        name: ROUTE_NAME_ADMIN.GROUP_USER,
        path: ':groupId/user',
        component: AdminGroupUser,
        props: true,
        meta: {
            title: '分组用户',
            requirePermission: true
        }
    }]
}

export const ROUTES_ADMIN = [ROUTE_ADMIN_PERMISSION, ROUTE_ADMIN_GROUP, ROUTE_ADMIN_USER]