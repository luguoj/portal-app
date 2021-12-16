Ext.define('PortalApp.view.portalConsole.group.GroupModuleActionView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-groupmoduleactionview',
    config: {
        group: null
    },
    controller: 'portalconsole-group-groupmoduleactionviewcontroller',
    viewModel: {
        data: {},
        stores: {}
    }
});