Ext.define('PortalApp.store.EntityTreeStore', {
    extend: 'PSR.data.AjaxTreeStore',
    alias: 'store.entitytree',
    config: {
        application: '',
        domainType: '',
        rootText: 'ROOT',
        transform: null, // 'parentTree or pathTree'
        parentIdField: 'parentId',
        pathField: 'path',
        displayField: 'text'
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
        if (proxy) {
            const store = this,
                reader = proxy.getReader(),
                transform = this.getTransform(),
                application = this.getApplication(),
                domainType = this.getDomainType(),
                url = portalEnv.gateway + '/' + application + '/api/entity/' + domainType;
            proxy.setUrl(url);
            if (!reader.getTransform()) {
                if (transform == 'parentTree') {
                    reader.setTransform(function (data) {
                        return store.transformParentTree(data);
                    });
                } else if (transform == 'pathTree') {
                    reader.setTransform(function (data) {
                        return store.transformPathTree(data);
                    });
                }
            }
        }
    },
    applyRoot: function (value) {
        value.text = this.getRootText();
        return this.callParent([value]);
    },
    transformParentTree: function (data) {
        return PSR.data.reader.Transform.parentTree(data.content, {
            expand: true,
            parentIdField: this.getParentIdField(),
            root: {
                id: 'root',
                content: [],
                expanded: true,
                text: this.getRootText()
            }
        });
    },
    transformPathTree: function (data) {
        return PSR.data.reader.Transform.pathTree(data.content, {
            expand: true,
            pathField: this.getPathField(),
            displayField: this.getDisplayField(),
            root: {
                id: 'root',
                content: [],
                expanded: true,
                text: this.getRootText()
            }
        });
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
