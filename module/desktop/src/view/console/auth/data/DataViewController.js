Ext.define('PortalApp.view.console.auth.data.DataViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.console-auth-dataviewcontroller',
    COLUMN_CFG: {
        DATE: {
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s.u',
            width: PSR.util.Grid.getColumnWidth('0000-00-00 00:00:00.000'),
            resizable: false
        },
        BOOLEAN: {
            xtype: 'booleancolumn',
            trueText: '是',
            falseText: '否',
            width: PSR.util.Grid.getColumnWidth('是'),
        }
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
                            const filterFields = [], gridColumns = [];
                            for (let i = 0; i < data.length; i++) {
                                const datum = data[i];
                                const filterField = {
                                        name: datum.name,
                                        fieldLabel: datum.title,
                                        emptyText: datum.description
                                    },
                                    gridColumn = {
                                        dataIndex: datum.name,
                                        text: datum.description
                                    };
                                switch (datum.type) {
                                    case 'java.lang.Integer':
                                    case 'java.lang.Long':
                                        filterField.xtype = 'numberfield';
                                        gridColumn.xtype = 'numbercolumn';
                                        gridColumn.format = '0';
                                        break;
                                    case 'java.math.BigDecimal':
                                        filterField.xtype = 'numberfield';
                                        gridColumn.xtype = 'numbercolumn';
                                        gridColumn.format = datum.format || '0.000';
                                        break;
                                    case 'java.time.LocalDateTime':
                                        filterField.xtype = 'datefield';
                                        filterField.format = 'Y-m-d H:i:s.u';
                                        filterField.altFormats = 'Y-m-d\\TH:i:s.u';
                                        Object.assign(gridColumn, me.COLUMN_CFG.DATE);
                                        break;
                                    case 'java.lang.Boolean':
                                        filterField.xtype = 'checkboxfield';
                                        Object.assign(gridColumn, me.COLUMN_CFG.BOOLEAN);
                                    case 'java.lang.String':
                                        filterField.xtype = 'textfield';
                                        break;
                                    default:
                                        filterField.xtype = 'textfield';
                                }
                                filterFields.push(filterField);
                                gridColumns.push(gridColumn);
                            }
                            filterForm.add(filterFields);
                            grid.reconfigure(gridColumns);
                            entityStore.setDomainType(newValue);
                            entityStore.setFilterOptions('');
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
            grid = view.down('grid');
    }
});
