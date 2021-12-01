Ext.define('PSR.store.DomainTypeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.psr-domaintype',
    config: {
        application: ''
    },
    updateApplication: function () {
        this.updateUrl();
    },
    updateUrl: function () {
        const proxy = this.getProxy();
        if (proxy) {
            const application = this.getApplication(),
                url = portalEnv.gateway + '/' + application + '/api/domain_schema/domain_type';
            proxy.setUrl(url);
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.updateUrl();
    },
    proxy: {
        type: 'psr-ajax',
        withAuthToken: true
    }
});
