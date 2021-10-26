Ext.define('PortalApp.view.main.WorkspaceView', {
    extend: 'Ext.tab.Panel',
    xtype: 'main-workspaceview',
    controller: 'main-workspaceviewcontroller',
    plugins: {
        tabreorderer: true
    },
    tabPosition: 'bottom',
    plain: true,
    ui: 'portal-workspace-tab',
    defaults: {
        closable: true
    },
    items: [{
        title: 'Dashboard'
    },{
        title: 'Dashboard'
    },{
        title: 'Dashboard'
    },{
        title: 'Dashboard'
    },{
        title: 'Dashboard'
    }],
    switchNode: function (node) {
        this.getController().switchNode(node);
    },
    exitNode: function (node) {
        this.getController().exitNode(node);
    }
});
