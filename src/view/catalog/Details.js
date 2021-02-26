Ext.define('PSR.view.catalog.Details', {
    extend: 'PSR.view.crud.Details',
    xtype: 'psr-catalog-details',
    config: {
        catalogService: undefined,
        catalogUsageStore: null
    },
    formFields: [{
        xtype: 'hiddenfield', name: 'id'
    }, {
        xtype: 'hiddenfield', name: 'version'
    }, {
        xtype: 'fieldset',
        title: '基本信息', instructions: '基本信息',
        items: [{
            xtype: 'combobox', label: '用途', name: 'usage',
            editable: false, required: true,
            queryMode: 'local',
            bind: {store: '{usageSelections}', disabled: '{!tbeditor.creating}'}
        }, {
            xtype: 'textfield', label: '路径', name: 'path',
            required: true,
            bind: {disabled: '{!tbeditor.editing}'}
        }]
    }],
    controller: {
        getService: function () {
            return this.getView().getCatalogService();
        }
    },
    constructor: function (config) {
        const viewModel = config.viewModel = config.viewModel || {},
            stores = viewModel.stores = viewModel.stores || {};
        stores.usageSelections = stores.usageSelections
            || {
                type: config.catalogUsageStore || this.config.catalogUsageStore
            };
        this.callParent([config]);
    }
});
