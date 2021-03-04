Ext.define('PSR.view.catalog.List', {
    extend: 'PSR.view.crud.List',
    xtype: 'psr-catalog-list',
    config: {
        catalogService: undefined,
        catalogStore: null
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
    actions: {
        create: true,
        clone: false,
        delete: true
    },
    requireRefresh: function (opt) {
        return opt && opt.record;
    },
    controller: {
        getService: function () {
            return this.getView().getCatalogService();
        }
    },
    constructor: function (config) {
        const viewModel = config.viewModel = config.viewModel || {},
            stores = viewModel.stores = viewModel.stores || {};
        stores.entities = stores.entities
            || {
                type: config.catalogStore || this.config.catalogStore,
                filterer: 'bottomup'
            };
        this.callParent([config]);
    }
});
