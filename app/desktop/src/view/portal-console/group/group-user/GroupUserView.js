Ext.define('PortalApp.view.portalConsole.group.GroupUserView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-groupuserview',
    config: {
        group: null
    },
    controller: 'portalconsole-group-groupuserviewcontroller',
    viewModel: {
        data: {},
        stores: {}
    }
});