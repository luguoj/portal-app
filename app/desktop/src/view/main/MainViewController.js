Ext.define('PortalApp.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainviewcontroller',
    routes: {
        ':routeHash': {action: 'mainRoute'}
    },
    initViewModel: function (vm) {
        var me = this;
        vm.getStore('navNodes').on({
            load: function (store, records, success) {
                if (me.switchingNodeId) {
                    me.switchNode(me.switchingNodeId);
                    delete me.switchingNodeId;
                } else {
                    Ext.route.Router.onStateChange(Ext.util.History.getToken())
                }
            }
        });
        me.loadProfile();
    },
    loadProfile: function () {
        const me = this,
            token = PSR.util.Auth.getClientToken(function (token) {
                me.loadProfile();
            });
        if (token) {
            const viewModel = this.getViewModel(),
                navNodeStore = this.getStore('navNodes');
            PortalApp.data.api.portal.UserProfileApi.portal({
                success: function (data) {
                    const navigationItems = [];
                    if (data.dashboardTemplates && data.dashboardTemplates.length > 0) {
                        navigationItems.push({
                            "id": "dashboard",
                            "text": "概览",
                            "iconCls": "x-fa fa-chart-line",
                            "expanded": false,
                            "sort": -1
                        });
                        for (let i = 0; i < data.dashboardTemplates.length; i++) {
                            const dashboardTemplate = data.dashboardTemplates[i];
                            if (dashboardTemplate.config) {
                                const viewConfig = Object.assign({
                                        xtype: 'dashboard-partview'
                                    },
                                    eval('(' + dashboardTemplate.config + ')')
                                );
                                navigationItems.push({
                                    "id": "dashboardview-" + dashboardTemplate.id,
                                    "parentId": "dashboard",
                                    "text": dashboardTemplate.description,
                                    "iconCls": "x-fa fa-chart-line",
                                    "viewConfig": {
                                        "xtype": "dashboardview",
                                        "mainPart": viewConfig
                                    },
                                    "sort": dashboardTemplate.description
                                });
                            }
                        }
                    }
                    navigationItems.push(...data.navigationItems);
                    navNodeStore.getProxy().setData(navigationItems);
                    navNodeStore.load();
                    viewModel.set('appTitle', data.portal.description);
                    document.title = data.portal.description;
                }
            });
            viewModel.set('personnel_description', token.username);
            PortalApp.data.api.entity.EntityCRUDApi.findAllById({
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.UserPersonnelEntity',
                ids: [token.username],
                success: function (data) {
                    if (data && data.length > 0) {
                        viewModel.set('personnel_description', data[0].lastName + ' ' + data[0].firstName);
                    }
                }
            });
        }
    },
    mainRoute: function (routeHash) {
        var vm = this.getViewModel(),
            nodes = vm.getStore('navNodes'),
            nodeId = window.atob(routeHash);
        if (nodes.isLoaded()) {
            this.switchNode(nodeId);
        } else {
            this.switchingNodeId = nodeId;
        }
    },
    switchNode: function (nodeId) {
        var v = this.getView(),
            workspaceView = v.down('main-workspaceview'),
            navigationView = v.down('main-navigationview'),
            vm = this.getViewModel(),
            nodes = vm.getStore('navNodes'),
            targetNode;
        targetNode = nodes.isTreeStore
            ? nodes.findNode('id', nodeId)
            : nodes.findRecord('id', nodeId);
        if (targetNode == null) {
            console.log('unmatchedRoute: ' + nodeId);
            workspaceView.switchView({
                viewId: nodeId
            });
            navigationView.switchNode({
                nodeId: nodeId
            });
        } else {
            workspaceView.switchView({
                viewId: targetNode.get('id'),
                title: targetNode.get('text'),
                iconCls: targetNode.get('iconCls'),
                moduleId: targetNode.get('moduleId'),
                viewConfig: targetNode.get('viewConfig')
            });
            navigationView.switchNode({
                nodeId: targetNode.get('id')
            });
        }
    },
    hBtnFullscreen: function () {
        const view = this.getView(),
            btnExitFullscreen = this.lookup('btnExitFullscreen'),
            navigationview = view.down('main-navigationview'),
            maintitle = view.down('toolbar[ui=portal-main-toolbar]'),
            tabbar = view.down('tabbar');
        btnExitFullscreen.show();
        navigationview.hide(btnExitFullscreen);
        maintitle.hide(btnExitFullscreen);
        tabbar.hide(btnExitFullscreen);
        const el = document.documentElement,
            rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;
        if (typeof rfs != 'undefined' && rfs) {
            rfs.call(el);
        }
        this.getViewModel().set('fullscreen', true);
    },
    hBtnExitFullscreen: function () {
        const view = this.getView(),
            btnExitFullscreen = this.lookup('btnExitFullscreen'),
            navigationview = view.down('main-navigationview'),
            maintitle = view.down('toolbar[ui=portal-main-toolbar]'),
            tabbar = view.down('tabbar');
        navigationview.show(btnExitFullscreen);
        maintitle.show(btnExitFullscreen);
        tabbar.show(btnExitFullscreen);
        btnExitFullscreen.hide();
        const el = document,
            cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.msCancelFullscreen;
        if (typeof cfs != 'undefined' && cfs) {
            cfs.call(el);
        }
        this.getViewModel().set('fullscreen', false);
    },
    hBtnLogout: function () {
        PSR.util.Message.confirm(
            "是否要登出当前用户",
            function () {
                PSR.util.Auth.logout();
            });
    }
});
