Ext.define('PSR.view.catalog.List', {
    extend: 'PSR.view.crud.List',
    xtype: 'psr-catalog-list',
    config: {
        catalogService: undefined,
        catalogStore: null,
        catalogUsageStore: null
    },
    isTree: true,
    columns: [{
        xtype: 'psr-grid-column-treehref',
        text: '目录', flex: 1,
        menuDisabled: true, sortable: false,
        cell: {
            encodeHtml: false,
            handler: 'go_details'
        },
        dataIndex: 'displaytext',
        renderer: 'filterRenderer'
    }],
    requireRefresh: function (opt) {
        return opt && opt.record;
    },
    controller: {
        getService: function () {
            return this.getView().getCatalogService();
        }
    },
    constructor: function (config) {
        const me = this,
            viewModel = config.viewModel = config.viewModel || {},
            stores = viewModel.stores = viewModel.stores || {};
        stores.entities = stores.entities
            || {
                type: config.catalogStore || this.config.catalogStore,
                filterer: 'bottomup',
                listeners: {
                    load: function (store) {
                        const usages = me.getViewModel().getStore('usages').data.items;
                        for (let i = 0; i < usages.length; i++) {
                            const usageNode = store.byIdMap[usages[i].get('value')];
                            if (usageNode) {
                                usageNode.set('text', usages[i].get('text'));
                            }
                        }
                    }
                }
            };
        stores.usages = stores.usages
            || {
                type: config.catalogUsageStore || this.config.catalogUsageStore
            };
        this.callParent([config]);
    }
});
