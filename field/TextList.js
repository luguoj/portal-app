Ext.define('PSR.field.TextList', {
    extend: 'Ext.field.Container',
    xtype: 'psr-field-textlist',
    minHeight: '200',
    controller: {
        hLstToolClose: function (grid, event) {
            this.getViewModel().getStore('textValues').remove(event.record);
        },
        hButtonAdd: function () {
            var vm = this.getViewModel();
            var value = vm.get('newValue');
            if (value) {
                vm.getStore('textValues').add({value: value});
            }
            vm.set('newValue', '');
        }
    },
    viewModel: {
        data: {
            newValue: '',
            fieldLabel: '',
            fieldDisabled: false
        },
        stores: {
            textValues: {
                data: []
            }
        }
    },
    layout: 'fit',
    items: [{
        xtype: 'panel',
        border: true,
        layout: 'vbox',
        items: [{
            xtype: 'toolbar',
            items: [{
                xtype: 'textfield',
                flex: 1,
                bind: '{newValue}'
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-save',
                handler: 'hButtonAdd',
                bind: {hidden: '{fieldDisabled}'}
            }],
        }, {
            xtype: 'grid',
            flex: 1,
            hideHeaders: true,
            columns: [{
                flex: 1,
                dataIndex: 'value',
                cell: {
                    tools: {
                        close: {
                            handler: 'hLstToolClose',
                            zone: 'end',
                            bind: {hidden: '{fieldDisabled}'}
                        }
                    }
                }
            }],
            bind: {store: '{textValues}'}
        }],
    }],
    getValue: function () {
        var data = this.getViewModel().getStore('textValues').getData();
        var textValues = [];
        if (data && data.items) {
            for (var i = 0; i < data.items.length; i++) {
                textValues.push(data.items[i].data.value);
            }
        }
        return textValues.join(',');
    },
    setValue: function (value) {
        var vm = this.getViewModel(), store = vm.getStore('textValues');
        vm.set('newValue', '');
        if (value) {
            var textValues = value.split(',');
            var data = [];
            for (var i = 0; i < textValues.length; i++) {
                data.push({value: textValues[i]});
            }
            store.setData(data);
        } else {
            store.removeAll();
        }
    },
    updateDisabled: function (value) {
        this.getViewModel().set('fieldDisabled', value);
        this.callParent([value]);
    }
});
