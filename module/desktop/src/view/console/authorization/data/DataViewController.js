Ext.define('PortalApp.view.console.authorization.data.DataViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.console-authorization-dataviewcontroller',
    createColumnCfg: function (fieldSchema) {
        const fieldType = fieldSchema.type,
            columnCfg = {
                dataIndex: fieldSchema.name,
                text: fieldSchema.description
            };
        switch (fieldType) {
            case 'java.lang.Integer':
            case 'java.lang.Long':
                Object.assign(columnCfg, {
                    xtype: 'numbercolumn',
                    format: '0',
                    filter: 'number'
                });
                break;
            case 'java.math.BigDecimal':
                Object.assign(columnCfg, {
                    xtype: 'numbercolumn',
                    format: fieldSchema.format ? fieldSchema.format : '0.000',
                    filter: 'number'
                });
                break;
            case 'java.time.LocalDateTime':
                Object.assign(columnCfg, {
                    xtype: 'datecolumn',
                    format: 'Y-m-d H:i:s.u',
                    width: PSR.util.Grid.getColumnWidth('0000-00-00 00:00:00.000'),
                    resizable: false,
                    filter: {
                        type: 'date',
                        dateFormat: 'Y-m-d\\TH:i:s.u'
                    }
                });
                break;
            case 'java.lang.Boolean':
                Object.assign(columnCfg, {
                    xtype: 'booleancolumn',
                    width: PSR.util.Grid.getColumnWidth('是'),
                    filter: 'boolean'
                });
                break;
            case 'java.lang.String':
                Object.assign(columnCfg, {
                    filter: 'string'
                });
                break;
            default:
        }
        return columnCfg;
    },
    hCombDomainTypeChange: function (comb, newValue) {
        const me = this,
            view = this.getView(),
            filterForm = view.down('container[region=west]'),
            grid = view.down('grid'),
            viewModel = this.getViewModel(),
            entityStore = viewModel.getStore('entities');
        filterForm.removeAll();
        if (newValue) {
            PortalApp.data.authorization.DomainTypeApi.findSchemaByDomainType(
                {
                    domainType: newValue,
                    success: function (data) {
                        if (data && data.length > 0) {
                            viewModel.set('domainSchema', data);
                            const filterFields = [], gridColumns = [];
                            for (let i = 0; i < data.length; i++) {
                                const fieldSchema = data[i],
                                    columnCfg = me.createColumnCfg(fieldSchema);
                                const filterField = {
                                        name: fieldSchema.name,
                                        fieldLabel: fieldSchema.title,
                                        emptyText: fieldSchema.description
                                    };
                                switch (fieldSchema.type) {
                                    case 'java.lang.Integer':
                                    case 'java.lang.Long':
                                        filterField.xtype = 'numberfield';
                                        break;
                                    case 'java.math.BigDecimal':
                                        filterField.xtype = 'numberfield';
                                        break;
                                    case 'java.time.LocalDateTime':
                                        filterField.xtype = 'datefield';
                                        filterField.format = 'Y-m-d H:i:s.u';
                                        filterField.altFormats = 'Y-m-d\\TH:i:s.u';
                                        break;
                                    case 'java.lang.Boolean':
                                        filterField.xtype = 'checkboxfield';
                                        break;
                                    case 'java.lang.String':
                                        filterField.xtype = 'textfield';
                                        break;
                                    default:
                                        PSR.util.Message.error('不支持的字段类型: ' + fieldSchema.title + '(' + fieldSchema.name + ')' + ' - ' + fieldSchema.type);

                                }
                                filterFields.push(filterField);
                                gridColumns.push(columnCfg);
                            }
                            filterForm.add(filterFields);
                            grid.reconfigure(gridColumns);
                            entityStore.setDomainType(newValue);
                            entityStore.load();
                        }
                    }
                }
            );
        }
    },
    hBtnFilterToggle: function (btn, pressed) {
        const view = this.getView(),
            filterView = view.down('container[region=west]');
        if (pressed) {
            filterView.show(btn);
        } else {
            filterView.hide(btn);
        }
    },
    hBtnSearch: function () {
        const view = this.getView(),
            filterForm = view.down('container[region=west]'),
            filterValues = filterForm.getValues(),
            viewModel = this.getViewModel(),
            entityStore = viewModel.getStore('entities'),
            domainSchema = viewModel.get('domainSchema');
        if (domainSchema) {
            for (let i = 0; i < domainSchema.length; i++) {
                const fieldSchema = domainSchema[i];

            }
        }
    }
});
