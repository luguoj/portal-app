Ext.define('PortalApp.view.authorizationConsole.authority.UserViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-authority-userviewcontroller',
    afterRender: function (view) {
        if (view.getAuthority()) {
            this.loadData();
        }
    },
    loadData: function () {
    },
});