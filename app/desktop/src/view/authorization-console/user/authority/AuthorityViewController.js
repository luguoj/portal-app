Ext.define('PortalApp.view.authorizationConsole.user.AuthorityViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-user-authorityviewcontroller',
    afterRender: function (view) {
        if (view.getUser()) {
            this.loadData();
        }
    },
    loadData: function () {
    },
});