Ext.define('PortalApp.store.EntityStore', {
    extend: 'PSR.data.AjaxStore',
    alias: 'store.entity',
    config: {
        application: '',
        domainType: ''
    },
    withAuthToken: true,
    updateApplication: function () {
        this.updateUrl();
    },
    updateDomainType: function () {
        this.updateUrl();
    },
    updateUrl: function () {
        const proxy = this.getProxy();
        if (proxy) {
            const application = this.getApplication(),
                domainType = this.getDomainType(),
                url = portalEnv.gateway + '/' + application + '/api/entity/' + domainType;
            proxy.setUrl(url);
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.updateUrl();
    },
    proxy: {
        type: 'entity'
    },
    load: function (opt) {
        if (!this.getApplication()) {
            PSR.util.Message.error('缺少参数：应用');
        } else if (!this.getDomainType()) {
            PSR.util.Message.error('缺少参数：领域类型');
        } else {
            this.callParent([opt]);
        }
    }
});
