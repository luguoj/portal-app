Ext.define('PortalApp.view.console.authorization.data.DataViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.console-authorization-dataviewmodel',
    data: {
        domainSchema: null
    },
    stores: {
        domainTypes: {
            type: 'portalapp-authorization-domaintype',
            autoLoad: true
        },
        entities: {
            type: 'portalapp-authorization-entity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false
        }
    }
});
