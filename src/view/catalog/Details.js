Ext.define('PSR.view.catalog.Details', {
    extend: 'PSR.view.crud.Details',
    xtype: 'psr-catalog-details',
    formFields: [{
        xtype: 'hiddenfield', name: 'id'
    }, {
        xtype: 'fieldset',
        title: '基本信息', instructions: '基本信息',
        items: [{
            xtype: 'combobox', label: '用途', name: 'usage',
            editable: false, required: true,
            queryMode: 'local',
            bind: {store: '{usageSelections}', disabled: '{!tbeditor.creating}'}
        }, {
            xtype: 'textfield', label: '路径', name: 'path', required: true
        }],
        bind: {disabled: '{!tbeditor.editing}'}
    }],
    viewModel: {
        stores: {
            usageSelections: {
                type: 'catalogusage'
            }
        }
    },
    controller: {
        getService: function () {
            return this.getView().up('psr-catalog').getService();
        }
    }
});
