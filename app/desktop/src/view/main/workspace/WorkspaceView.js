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
    switchView: function (opt) {
        this.getController().switchView(opt);
    }
});
