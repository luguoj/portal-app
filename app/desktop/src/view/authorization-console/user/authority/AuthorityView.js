Ext.define('PortalApp.view.authorizationConsole.user.AuthorityView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-user-authorityview',
    controller: 'authorizationconsole-user-authorityviewcontroller',
    config: {
        user: null
    },
    updateUser: function (value) {
        this.getViewModel().set('user', value);
        if (this.rendered) {
            this.getController().loadData();
        }
    },
    viewModel: {
        data: {
            user: null
        },
        stores: {}
    }
});