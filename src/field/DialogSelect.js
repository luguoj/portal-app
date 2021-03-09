Ext.define('PSR.field.dialogSelect', {
    extend: 'Ext.field.Container',
    xtype: 'psr-field-dialogselect',
    mixins: ['PSR.mixin.Storable'],
    minWidth: 150,
    layout: 'hbox',
    config: {
        required: false,
        picker: {
            xtype: 'psr-panel-dataviewpicker'
        },
        placeholder: '',
        displayField: 'displaytext',
        valueField: 'value',
        valueFieldName: '',
        filterFields: [],
        extraParams: {},
        paramConverter: function (values) {
            return values;
        },
        selectionReader: function (field, value, success) {
            const valueField = field.getValueField(),
                displayField = field.getDisplayField(),
                selection = {};
            selection[valueField] = value;
            selection[displayField] = value;
            success(selection);
        }
    },
    updateDisabled: function (value) {
        this.displayer.setDisabled(value);
        this.trigger.setDisabled(value);
    },
    expand: function () {
        const pickerDialog = this.pickerDialog,
            store = this.getStore();
        pickerDialog.show();
        if (store) {
            store.reload();
        }
    },
    constructor: function (config) {
        const me = this,
            placeholder = config.placeholder || this.config.placeholder,
            displayField = config.displayField || this.config.displayField,
            valueField = config.valueField || this.config.valueField,
            filterFields = [].concat(config.filterFields || this.config.filterFields || []),
            extraParams = config.extraParams || this.config.extraParams,
            paramConverter = config.paramConverter || this.config.paramConverter,
            required = config.required || this.config.required,
            valueFieldName = config.valueFieldName || this.config.valueFieldName,
            valueHolder = {
                xtype: 'textfield', reference: 'fValueHolder',
                width: 0,
                editable: false,
                required: required,
                name: valueFieldName
            },
            displayer = {
                xtype: 'textfield', reference: 'fDisplayer',
                flex: 1,
                editable: false,
                placeholder: placeholder,
                required: required,
                listeners: {
                    clearicontap: function () {
                        me.setValue(null);
                    }
                }
            },
            trigger = {
                xtype: 'button',
                iconCls: 'x-fa fa-search-location',
                handler: function () {
                    me.expand();
                }
            };
        config.items = [valueHolder, displayer, trigger];
        me.pickerDialog = Ext.create({
            xtype: 'dialog',
            padding: 0,
            width: '50%',
            height: '50%',
            layout: 'fit',
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                items: [{
                    tooltip: '过滤', iconCls: 'x-fa fa-filter',
                    enableToggle: true,
                    toggleHandler: function (btn, pressed) {
                        me.picker.expandFilter(pressed);
                    }
                }, {
                    tooltip: '搜索', iconCls: 'x-fa fa-search',
                    handler: function () {
                        me.picker.refresh();
                    }
                }, '->', {
                    tooltip: '确认', iconCls: 'x-fa fa-check', reference: 'btnOK',
                    ui: 'confirm',
                    handler: function (btn) {
                        me.setValue(btn.selection.get(valueField));
                        me.pickerDialog.hide();
                    },
                    disabled: true,
                }, {
                    tooltip: '取消', iconCls: 'x-fa fa-times',
                    ui: 'decline',
                    handler: function () {
                        me.pickerDialog.hide();
                    }
                }]
            }, {
                xtype: 'psr-panel-dataviewpicker',
                fieldTitle: placeholder,
                displayField: displayField,
                filterFields: filterFields,
                extraParams: extraParams,
                paramConverter: paramConverter,
                listeners: {
                    selectionchange: function (picker, selections) {
                        const btnOK = picker.up('dialog').down('button[reference="btnOK"]');
                        if (selections && selections.length > 0 && selections[0].get('isRecord')) {
                            btnOK.setDisabled(false);
                            btnOK.selection = selections[0];
                        } else {
                            btnOK.setDisabled(true);
                        }
                    }
                }
            }]
        });
        me.picker = me.pickerDialog.down('psr-panel-dataviewpicker');
        me.callParent([config]);
        me.valueHolder = me.down('textfield[reference="fValueHolder"]');
        me.displayer = me.down('textfield[reference="fDisplayer"]');
        me.trigger = me.down('button');
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
    updateStore: function (store) {
        if (this.picker) {
            this.picker.setStore(store);
        }
    },
    updateValue: function (newValue, oldValue) {
        this.selectionSync(newValue);
        this.valueHolder.setValue(newValue);
        this.fireEvent('change', this, newValue, oldValue);
    },
    reset: function () {
        this.setValue(this.originalValue);
    },
    selectionSync: function (value) {
        const field = this,
            displayer = field.displayer,
            valueField = field.getValueField(),
            displayField = field.getDisplayField(),
            selectionReader = field.getSelectionReader();
        if (!displayer) {
            return;
        }
        if (value) {
            selectionReader(field, value, function (selection) {
                displayer.setValue(selection[displayField]);
            });
        } else {
            displayer.setValue(null);
        }
    }
});
