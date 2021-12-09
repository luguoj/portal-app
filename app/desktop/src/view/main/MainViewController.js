Ext.define('PortalApp.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainviewcontroller',
    routes: {
        ':nodeId': {action: 'mainRoute'}
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
        })
    },
    mainRoute: function (nodeId) {
        var vm = this.getViewModel(),
            nodes = vm.getStore('navNodes');
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
    },
    hBtnLogout: function () {
        PSR.util.Message.confirm(
            "是否要登出当前用户",
            function () {
                PSR.util.Auth.logout();
            });
    }
});
