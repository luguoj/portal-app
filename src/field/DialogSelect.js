Ext.define('PSR.field.dialogSelect', {
    extend: 'Ext.field.Container',
    xtype: 'psr-field-dialogselect',
    mixins: ['PSR.mixin.Storable'],
    minWidth: 150,
    layout: 'hbox',
    config: {
        required: false,
        isTree: false,
        placeholder: '',
        displayField: 'displaytext',
        pickerDisplayField: 'displaytext',
        valueField: 'value',
        valueFieldName: null,
        filterFields: [],
        extraParams: {},
        paramConverter: function (values) {
            return values;
        },
        selectionReader: function (field, value, success) {
            const valueField = field.getValueField(),
                displayField = field.getDisplayField(),
                store = field.getStore(),
                selection = {};
            selection[valueField] = value;
            selection[displayField] = value;
            if (store) {
                const record = store.findRecord(valueField, value);
                if (record) {
                    Object.assign(selection, record.data);
                }
            }
            success(selection);
        }
    },
    updateDisabled: function (value) {
        this.displayer.setDisabled(value);
        this.trigger.setDisabled(value);
    },
    expand: function () {
        const me = this,
            placeholder = me.getPlaceholder(),
            isTree = me.getIsTree(),
            displayField = me.getPickerDisplayField() || me.getDisplayField(),
            valueField = me.getValueField(),
            filterFields = me.getFilterFields(),
            extraParams = me.getExtraParams(),
            paramConverter = me.getParamConverter(),
            store = me.getStore(),
            pickerDialog = Ext.create({
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
                            picker.expandFilter(pressed);
                        }
                    }, {
                        tooltip: '搜索', iconCls: 'x-fa fa-search',
                        handler: function () {
                            picker.refresh();
                        }
                    }, '->', {
                        tooltip: '确认', iconCls: 'x-fa fa-check', reference: 'btnOK',
                        ui: 'confirm',
                        handler: function (btn) {
                            me.setValue(btn.selection.get(valueField));
                            delete this.picker;
                            pickerDialog.close();
                        },
                        disabled: true,
                    }, {
                        tooltip: '取消', iconCls: 'x-fa fa-times',
                        ui: 'decline',
                        handler: function () {
                            delete this.picker;
                            pickerDialog.close();
                        }
                    }]
                }, {
                    xtype: 'psr-panel-dataviewpicker',
                    isTree: isTree,
                    fieldTitle: placeholder,
                    displayField: displayField,
                    filterFields: filterFields,
                    extraParams: extraParams,
                    paramConverter: paramConverter,
                    store: store,
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
                }],
                listeners: {
                    show: function () {
                        picker.refresh();
                    }
                }
            }),
            picker = this.picker = pickerDialog.down('psr-panel-dataviewpicker');
        pickerDialog.show();
    },
    constructor: function (config) {
        const me = this,
            placeholder = config.placeholder || this.config.placeholder,
            required = config.required || this.config.required,
            valueFieldName = config.valueFieldName || this.config.valueFieldName,
            value = config.value || this.config.value,
            valueHolder = {
                xtype: 'textfield', reference: 'fValueHolder',
                width: 0,
                editable: false,
                required: required,
                name: valueFieldName,
                value: value
            },
            displayer = {
                xtype: 'textfield', reference: 'fDisplayer',
                flex: 1,
                editable: false,
                placeholder: placeholder,
                required: required,
                value: value,
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
        me.callParent([config]);
        me.valueHolder = me.down('textfield[reference="fValueHolder"]');
        me.displayer = me.down('textfield[reference="fDisplayer"]');
        me.trigger = me.down('button');
    },
    updateStore: function (store) {
        if (this.picker) {
            this.picker.setStore(store);
        }
    },
    updateValue: function (newValue, oldValue) {
        this.selectionSync(newValue);
        if (this.valueHolder) {
            this.valueHolder.setValue(newValue);
        }
        this.fireEvent('change', this, newValue, oldValue);
    },
    reset: function () {
        this.setValue(this.originalValue);
    },
    selectionSync: function (value) {
        const field = this,
            displayer = field.displayer,
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
