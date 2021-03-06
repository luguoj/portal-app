Ext.define('PortalApp.data.api.portal.UserProfileApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/portal/api/';
    },
    module: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'GET',
            url: url + 'user_profile/module/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    portal: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'GET',
            url: url + 'user_profile/portal/' + window.portalEnv.portalCode + '-' + window.portalEnv.profile,
            withAuthToken: true,
            bizSuccess: function (data) {
                data = Object.assign({navigationItems: [], dashboardTemplates: []}, data);
                if (PSR.util.Auth.clientToken.username == 'platform_admin') {
                    data.navigationItems.push(...PortalApp.data.api.portal.UserProfileApi.getPlatformAdminNavigationItems());
                } else if (window.portalEnv.develop) {
                    PortalApp.data.api.portal.UserProfileApi.getDeveloperNavigationItems({
                        success: function (developerNavigationItems) {
                            data.navigationItems.push(...developerNavigationItems);
                        }
                    });
                }
                opt.success(data);

            },
            failure: opt.failure,
            complete: opt.complete
        });
    },
    getPlatformAdminNavigationItems: function () {
        const data = PortalApp.data.api.portal.UserProfileApi.navigationItems[window.portalEnv.profile].platformAdmin;
        data.push(...PortalApp.data.api.portal.UserProfileApi.navigationItems.developmentDocs);
        return data;
    },
    getDeveloperNavigationItems: function (opt) {
        Ext.Ajax.request({
            method: 'GET',
            url: 'resources/' + window.portalEnv.profile + '/navigation_item/developer.json',
            success: function (data) {
                data = data || [];
                data.push(...PortalApp.data.api.portal.UserProfileApi.navigationItems.developmentDocs);
                opt.success(data);
            },
            failure: function () {
                PSR.util.Message.error("????????????????????????????????????");
                opt.success(PortalApp.data.api.portal.UserProfileApi.navigationItems.developmentDocs);
            }
        });
    },
    navigationItems: {
        desktop: {
            platformAdmin: [
                {
                    "id": "platformadminconsole",
                    "text": "????????????????????????",
                    "iconCls": "x-fa fa-laptop-code",
                    "expanded": true
                },
                {
                    "parentId": "platformadminconsole",
                    "id": "entityconsole",
                    "text": "????????????",
                    "iconCls": "x-fa fa-database",
                    "expanded": false
                },
                {
                    "parentId": "entityconsole",
                    "id": "entityconsoleview-authorization",
                    "text": "????????????",
                    "iconCls": "x-fa fa-user-edit",
                    "viewConfig": {
                        "xtype": "entityconsoleview",
                        "application": "authorization"
                    }
                },
                {
                    "parentId": "entityconsole",
                    "id": "entityconsoleview-file",
                    "text": "????????????",
                    "iconCls": "x-fa fa-file",
                    "viewConfig": {
                        "xtype": "entityconsoleview",
                        "application": "file"
                    }
                },
                {
                    "parentId": "entityconsole",
                    "id": "entityconsoleview-portal",
                    "text": "????????????",
                    "iconCls": "x-fa fa-desktop",
                    "viewConfig": {
                        "xtype": "entityconsoleview",
                        "application": "portal"
                    }
                },
                {
                    "parentId": "entityconsole",
                    "id": "entityconsoleview-organization",
                    "text": "????????????",
                    "iconCls": "x-fa fa-users",
                    "viewConfig": {
                        "xtype": "entityconsoleview",
                        "application": "organization"
                    }
                },
                {
                    "parentId": "platformadminconsole",
                    "id": "authorizationconsole",
                    "text": "????????????",
                    "iconCls": "x-fa fa-user-edit",
                    "expanded": false
                },
                {
                    "parentId": "authorizationconsole",
                    "id": "authorizationconsole-clientview",
                    "text": "?????????",
                    "iconCls": "x-fa fa-desktop",
                    "viewConfig": {
                        "xtype": "authorizationconsole-clientview"
                    }
                },
                {
                    "parentId": "authorizationconsole",
                    "id": "authorizationconsole-resourceview",
                    "text": "??????",
                    "iconCls": "x-fa fa-server",
                    "viewConfig": {
                        "xtype": "authorizationconsole-resourceview"
                    }
                },
                {
                    "parentId": "authorizationconsole",
                    "id": "authorizationconsole-userview",
                    "text": "??????",
                    "iconCls": "x-fa fa-user",
                    "viewConfig": {
                        "xtype": "authorizationconsole-userview"
                    }
                },
                {
                    "parentId": "authorizationconsole",
                    "id": "authorizationconsole-authorityview",
                    "text": "??????",
                    "iconCls": "x-fa fa-shield-alt",
                    "viewConfig": {
                        "xtype": "authorizationconsole-authorityview"
                    }
                },
                {
                    "parentId": "authorizationconsole",
                    "id": "authorizationconsole-groupview",
                    "text": "??????",
                    "iconCls": "x-fa fa-users",
                    "viewConfig": {
                        "xtype": "authorizationconsole-groupview"
                    }
                },
                {
                    "parentId": "platformadminconsole",
                    "id": "fileconsole",
                    "text": "????????????",
                    "iconCls": "x-fa fa-file-archive",
                    "viewConfig": {
                        "xtype": "fileconsoleview"
                    }
                },
                {
                    "parentId": "platformadminconsole",
                    "id": "portalconsole",
                    "text": "????????????",
                    "iconCls": "x-fa fa-desktop",
                    "expanded": false
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-portalview",
                    "text": "??????",
                    "iconCls": "x-fa fa-desktop",
                    "viewConfig": {
                        "xtype": "portalconsole-portalview"
                    }
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-moduleview",
                    "text": "??????",
                    "iconCls": "x-fa fa-cube",
                    "viewConfig": {
                        "xtype": "portalconsole-moduleview"
                    }
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-navigationitemview",
                    "text": "????????????",
                    "iconCls": "x-fa fa-sitemap",
                    "viewConfig": {
                        "xtype": "portalconsole-navigationitemview"
                    }
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-dashboard-partview",
                    "text": "????????????",
                    "iconCls": "x-fa fa-chart-pie",
                    "viewConfig": {
                        "xtype": "portalconsole-dashboard-partview"
                    }
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-dashboard-templateview",
                    "text": "????????????",
                    "iconCls": "x-fa fa-chart-line",
                    "viewConfig": {
                        "xtype": "portalconsole-dashboard-templateview"
                    }
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-groupview",
                    "text": "??????",
                    "iconCls": "x-fa fa-users",
                    "viewConfig": {
                        "xtype": "portalconsole-groupview"
                    }
                },
                {
                    "parentId": "portalconsole",
                    "id": "portalconsole-usergroupview",
                    "text": "????????????",
                    "iconCls": "x-fa fa-users",
                    "viewConfig": {
                        "xtype": "portalconsole-usergroupview"
                    }
                },
                {
                    "parentId": "platformadminconsole",
                    "id": "organizationconsole",
                    "text": "????????????",
                    "iconCls": "x-fa fa-users",
                    "expanded": true
                },
                {
                    "parentId": "organizationconsole",
                    "id": "organizationconsole-organizationview",
                    "text": "??????",
                    "iconCls": "x-fa fa-users",
                    "viewConfig": {
                        "xtype": "organizationconsole-organizationview"
                    }
                }]
        },
        phone: {
            platformAdmin: []
        },
        developmentDocs: [{
            "id": "development-docs",
            "text": "????????????",
            "iconCls": "x-fa fa-book-open",
            "expanded": false
        },
            {
                "parentId": "development-docs",
                "id": "docs-apiview",
                "text": "APIs",
                "iconCls": "x-fa fa-book-open",
                "viewConfig": {
                    "xtype": "docs-apiview"
                }
            },
            {
                "parentId": "development-docs",
                "id": "docs-extjsview",
                "text": "Extjs",
                "iconCls": "x-fa fa-book-open",
                "viewConfig": {
                    "xtype": "docs-extjsview"
                }
            }]
    }
});
