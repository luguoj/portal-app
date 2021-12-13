Ext.define('PortalApp.store.DomainTypeStore', {
    extend: 'PSR.data.AjaxStore',
    alias: 'store.domaintype',
    config: {
        application: ''
    },
    withAuthToken: true,
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
    }
});
