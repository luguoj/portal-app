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
    root: {
        id: 'root',
        loaded: true,
        content: [],
        expanded: true,
        text: 'ROOT'
    },
    updateProxy: function (proxy) {
        const application = this.getApplication(),
            domainType = this.getDomainType(),
            rootText = this.getRootText(),
            parentIdField = this.getParentIdField(),
            reader = proxy.getReader(),
            url = portalEnv.gateway + '/' + application + '/api/entity/' + domainType;
        proxy.setUrl(url);
        reader.rootText = rootText;
        reader.parentIdField = parentIdField;
    },
    applyRoot: function (value) {
        value.text = this.getRootText();
        return this.callParent([value]);
    },
    proxy: {
        type: 'entity',
        reader: {
            transform: function (data) {
                return PSR.data.reader.Transform.parentTree(data.content, {
                    expand: true,
                    parentIdField: this.parentIdField,
                    root: {
                        id: 'root',
                        content: [],
                        expanded: true,
                        text: this.rootText
                    }
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
