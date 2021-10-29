Ext.define('PortalApp.view.console.auth.data.DataViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.console-auth-dataviewmodel',
    stores: {
        domainTypes: {
            type: 'portalapp-authorization-domaintype',
            autoLoad: true
        },
        entities: {
            type: 'portalapp-authorization-entity',
            pageSize: 50,
            remoteSort: true,
            autoLoad: false
        }
    }
});
