Ext.define('PSR.data.store.CatalogTree', {
    extend: 'Ext.data.TreeStore',
    config: {
        catalogUsage: null,
        isRecord: true,
    },
    filterer: 'bottomup',
    pageSize: 0,
    fields: ['text', {
        name: 'displaytext',
        calculate: function (data) {
            return data.text;
        }
    }],
    proxy: {
        type: 'ajax',
        extraParams: {},
        reader: {
            transform: function (data) {
                return PSR.data.reader.Transform.catalogTree(data.content, {
                    expand: true,
                    hideUsage: this.hideUsage,
                    isRecord: this.isRecord
                });
            }
        }
    },
    constructor: function (config) {
        const catalogUsage = config.catalogUsage || this.config.catalogUsage,
            isRecord = config.isRecord || this.config.isRecord,
            proxy = config.proxy = config.proxy || {},
            reader = proxy.reader = proxy.reader || {};
        if (catalogUsage) {
            proxy.extraParams = proxy.extraParams || {};
            proxy.extraParams.searchParams = JSON.stringify({
                usage: [{
                    sign: 'INCLUDED',
                    operation: 'EQUAL',
                    from: catalogUsage
                }]
            });
            reader.hideUsage = true;
            config.root = {id: catalogUsage, text: catalogUsage};
        }
        reader.isRecord = isRecord;
        this.callParent([config]);
    }
});
