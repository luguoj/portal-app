Ext.define('PortalApp.view.portalConsole.group.GroupNavigationItemView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-groupnavigationitemview',
    config: {
        group: null
    },
    controller: 'portalconsole-group-groupnavigationitemviewcontroller',
    viewModel: {
        data: {},
        stores: {}
    }
});