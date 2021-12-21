Ext.define('PortalApp.view.main.WorkspaceView', {
    extend: 'Ext.tab.Panel',
    xtype: 'main-workspaceview',
    controller: 'main-workspaceviewcontroller',
    plugins: {
        tabreorderer: true,
        tabclosemenu: true
    },
    tabPosition: 'bottom',
    plain: true,
    ui: 'portal-main-workspace-tab',
    defaults: {
        closable: true
    },
    items: [],
    switchView: function (opt) {
        this.getController().switchView(opt);
    },
    listeners: {
        tabchange: 'onTabChange',
        remove: 'onTabRemove'
    }
});
