Ext.define('PortalApp.store.authorization.EntityStore', {
    extend: 'Ext.data.Store',
    alias: 'store.portalapp-authorization-entity',
    config: {
        domainType: '',
        filterOptions: '',
    },
    urlPrefix: portalEnv.gateway + '/authorization/api/entity/',
    updateDomainType: function () {
        const value = this.getDomainType(),
            proxy = this.getProxy();
        if (proxy) {
            proxy.setUrl(this.urlPrefix + value);
        }
    },
    updateFilterOptions: function () {
        const value = this.getFilterOptions(),
            proxy = this.getProxy();
        if (proxy) {
            const extraParams = proxy.getExtraParams() || {};
            proxy.setExtraParams(extraParams);
            extraParams.filterOptionsJson = JSON.stringify(value);
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.updateDomainType();
        this.updateFilterOptions();
    },
    proxy: {
        type: 'psr-ajax',
        url: portalEnv.gateway + '/authorization/api/entity/',
        withAuthToken: true
    },
    load: function (opt) {
        if (!this.getDomainType()) {
            PSR.util.Message.error('缺少参数：领域类型');
        } else {
            this.callParent([opt]);
        }
    }
});
