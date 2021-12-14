Ext.define('PortalApp.store.EntityTreeStore', {
    extend: 'PSR.data.AjaxTreeStore',
    alias: 'store.entitytree',
    config: {
        application: '',
        domainType: '',
        parentIdField: 'parentId',
        rootText: 'ROOT'
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
        const rootData = {
            id: 'root',
            content: [],
            expanded: true,
            text: this.getRootText()
        }
        this.setRoot(rootData);
        this.getProxy().getReader().rootData = rootData;
    },
    proxy: {
        type: 'entity',
        reader: {
            transform: function (data) {
                return PSR.data.reader.Transform.parentTree(data.content, {
                    expand: true,
                    root: this.rootData
                });
            }
        }
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
