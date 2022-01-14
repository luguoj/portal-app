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
        closable: true,
        listeners: {
            loadmodule: function (opt) {
                this.up('main-workspaceview').getController().loadModule(opt);
            },
            popupview: function (popup) {
                this.up('main-workspaceview').getController().onPopupView(this, popup);
            },
            resetview: function (newopt) {
                this.up('main-workspaceview').getController().onResetView(this, newopt);
            },
            switchview: function (newopt) {
                this.up('main-workspaceview').getController().switchView(newopt);
            }
        }
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
