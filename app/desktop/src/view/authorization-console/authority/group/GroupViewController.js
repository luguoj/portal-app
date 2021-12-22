Ext.define('PortalApp.view.authorizationConsole.authority.GroupViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-authority-groupviewcontroller',
    afterRender: function (view) {
        if (view.getAuthority()) {
            this.loadData();
        }
    },
    loadData: function () {
    },
});