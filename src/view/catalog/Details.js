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
        },
        createEntity: function () {
            var me = this,
                v = this.getView(),
                vm = this.getViewModel(),
                values = v.getValues(),
                tbeditor = me.lookup('tbeditor');
            v.mask({xtype: 'loadmask', message: '保存中...'});
            me.getService().create({
                values: values,
                success: function (data) {
                    if (data) {
                        Ext.toast("保存成功");
                        vm.set('dirty', true);
                        tbeditor.toggleEditing();
                        v.setValues(data);
                    }
                },
                failure: function () {
                    Ext.toast("保存失败")
                },
                complete: function () {
                    v.unmask();
                }
            });
        },
        updateEntity: function () {
            var me = this,
                v = this.getView(),
                vm = this.getViewModel(),
                values = v.getValues(),
                tbeditor = me.lookup('tbeditor');
            v.mask({xtype: 'loadmask', message: '保存中...'});
            me.getService().update({
                values: values,
                success: function (data) {
                    if (data) {
                        Ext.toast("保存成功");
                        vm.set('dirty', true);
                        v.setValues(data);
                    }
                },
                failure: function () {
                    Ext.toast("保存失败")
                },
                complete: function () {
                    v.unmask();
                }
            });
        }
    },
    loadEntity: function (record) {
        this.getController().loadEntity(record ? record.data.id : null);
        this.getViewModel().set('text', record ? record.get('path') : '');
    }
});
