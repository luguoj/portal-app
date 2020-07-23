Ext.define('PSR.field.dialogSelect.Base', {
    extend: 'Ext.field.Container',
    xtype: 'psr-field-dialogselect',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        hTriggerExpand: function () {
            var v = this.getView();
            v.pickerDialog.show();
            v.getStore().reload();
        },
        onClearIconTap: function () {
            this.getView().setValue('');
        },
        syncSelection: function () {
            var v = this.getView(),
                vm = this.getViewModel(),
                store = v.getStore(),
                valueField = v.getValueField(),
                displayField = v.getDisplayField(),
                value = v.getValue();
            if (!store) {
                vm.set('displayValue', value);
                return;
            }
            if (store && !store.isLoading() && !store.isLoaded()) {
                store.load();
                return;
            }
            if (value) {
                var record = store.isTreeStore ?
                    store.findNode(valueField, value)
                    : store.findRecord(valueField, value);
                vm.set('displayValue', record ? record.data[displayField] : value);
            } else {
                vm.set('displayValue', '');
            }
        },
    },
    viewModel: {
        data: {
            displayValue: ''
        }
    },
    layout: 'hbox',
    config: {
        picker: {
            lazy: true,
            $value: null
        },
        placeholder: '',
        displayField: 'text',
        valueField: 'value'
    },
    updateDisabled: function (value) {
        this.displayer.setDisabled(value);
        this.trigger.setDisabled(value);
    },
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        this.displayer = me.add({
            xtype: 'textfield',
            flex: 1,
            editable: false,
            disabled: this.getDisabled(),
            placeholder: this.getPlaceholder(),
            bind: '{displayValue}',
            listeners: {
                clearicontap: 'onClearIconTap'
            }
        });
        this.trigger = me.add({
            xtype: 'button',
            iconCls: 'x-fa fa-search-location',
            handler: 'hTriggerExpand',
            disabled: this.getDisabled()
        });
        me.pickerDialog = Ext.create(me.createDialog());
        me.picker = me.pickerDialog.add(me.createPicker());
        me.picker.setStore(me.getStore());
        me.picker.on({
            confirm: function (record) {
                me.setValue(record[0].data[me.getValueField()]);
                me.pickerDialog.hide();
            },
            cancel: function () {
                me.pickerDialog.hide();
            }
        });
    },
    createDialog: function () {
        return {
            xtype: 'dialog',
            padding: 0,
            width: '50%',
            height: '50%',
            layout: 'card'
        };
    },
    createPicker: function () {
        return this.getPicker();
    },
    updateStore: function (store) {
        if (this.picker) {
            this.picker.setStore(store);
        }
        this.getController().syncSelection();
    },
    onStoreLoad: function (store, records, success) {
        if (success) {
            this.getController().syncSelection();
        }
    },
    applyValue: function (value) {
        if (value && !Ext.isString(value)) {
            return value[this.getValueField()];
        } else {
            return value;
        }
    },
    updateValue: function (value) {
        this.getController().syncSelection();
    },
    reset: function () {
        this.setValue(this.originalValue);
    }
});
