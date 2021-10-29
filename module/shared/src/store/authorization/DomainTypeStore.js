Ext.define('PortalApp.store.authorization.DomainTypeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.portalapp-authorization-domaintype',
    proxy: {
        type: 'psr-ajax',
        url: portalEnv.gateway + '/authorization/api/domain_schema/domain_type',
        withAuthToken: true
    }
});
