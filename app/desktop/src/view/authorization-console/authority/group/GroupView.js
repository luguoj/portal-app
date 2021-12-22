Ext.define('PortalApp.view.authorizationConsole.authority.GroupView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-authority-groupview',
    controller: 'authorizationconsole-authority-groupviewcontroller',
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