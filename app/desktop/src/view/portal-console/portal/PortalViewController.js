Ext.define('PortalApp.view.portalConsole.PortalViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-portalviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const portalStore = this.getStore('portals')
        portalStore.load();
    },
    hBtnRefresh: function () {
        this.loadData();
    }
});
