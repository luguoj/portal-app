Ext.define('PortalApp.view.authorizationConsole.authority.UserView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-authority-userview',
    controller: 'authorizationconsole-authority-userviewcontroller',
    config: {
        authority: null
    },
    updateAuthority: function (value) {
        this.getViewModel().set('authority', value);
        if (this.rendered) {
            this.getController().loadData();
        }
    },
    viewModel: {
        data: {
            authority: null
        },
        stores: {}
    }
});