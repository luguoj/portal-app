import {PsrAppRouteRecordRaw} from "@/libs/commons/psr/app-context/route/types/PsrAppRouteRecordRaw";

const MODULE_PERSONAL_CENTER = 'personal-center'
export const ROUTE_PERSONAL_CENTER_PERSONNEL: PsrAppRouteRecordRaw = {
    name: MODULE_PERSONAL_CENTER + '/personnel',
    path: '',
    meta: {
        tag: {
            title: '人员信息'
        },
        permissions: false
    },
    component: () => import('./views/personnel/index.vue'),
    props: true
}
export const ROUTE_PERSONAL_CENTER_PASSWORD: PsrAppRouteRecordRaw = {
    name: MODULE_PERSONAL_CENTER + '/password',
    path: 'password',
    meta: {
        tag: {
            title: '密码'
        },
        permissions: false
    },
    component: () => import('./views/password/index.vue'),
    props: true
}
export const ROUTE_PERSONAL_CENTER_PHONE_NUMBER: PsrAppRouteRecordRaw = {
    name: MODULE_PERSONAL_CENTER + '/phone-number',
    path: 'phone-number',
    meta: {
        tag: {
            title: '电话号码'
        },
        permissions: false
    },
    component: () => import('./views/phone-number/index.vue'),
    props: true
}
export const ROUTE_PERSONAL_CENTER_EMAILS: PsrAppRouteRecordRaw = {
    name: MODULE_PERSONAL_CENTER + '/emails',
    path: 'emails',
    meta: {
        tag: {
            title: '邮件地址'
        },
        permissions: false
    },
    component: () => import('./views/emails/index.vue'),
    props: true
}
export const ROUTE_PERSONAL_CENTER: PsrAppRouteRecordRaw = {
    name: MODULE_PERSONAL_CENTER,
    path: MODULE_PERSONAL_CENTER,
    component: () => import('./views/index.vue'),
    meta: {
        tag: {
            title: '个人中心',
            iconCls: 'pi pi-user'
        },
        permissions: false
    },
    children: [
        ROUTE_PERSONAL_CENTER_PERSONNEL,
        ROUTE_PERSONAL_CENTER_PASSWORD,
        ROUTE_PERSONAL_CENTER_PHONE_NUMBER,
        ROUTE_PERSONAL_CENTER_EMAILS
    ]
}

export const routes: Array<PsrAppRouteRecordRaw> = [ROUTE_PERSONAL_CENTER]