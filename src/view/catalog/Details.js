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
            editable: false,
            queryMode: 'local',
            bind: {store: '{usageSelections}', disabled: '{!tbeditor.creating}'}
        }, {
            xtype: 'textfield', label: '路径', name: 'path'
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
    },
    load: function (opt, callback) {
        const me = this;
        if (opt == null || opt.record == null) {
            this.getController().loadEntity(null, null, callback);
        } else if (opt.create) {
            this.getController().loadEntity(null, null, function () {
                me.setValues({path: opt.record.data.path, usage: opt.record.data.usage});
                if (callback) {
                    callback();
                }
            });
        } else {
            this.getController().loadEntity(opt.record.data.id, null, callback);
        }
    },
    loadEntity: function (record) {
        this.getController().loadEntity(record ? record.data.id : null);
        this.getViewModel().set('text', record ? record.get('path') : '');
    }
});
