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
    onCombDomainTypeChange: function (comb, newValue) {
        const me = this,
            view = this.getView(),
            filterForm = view.down('container[region=west]'),
            grid = view.down('grid'),
            viewModel = this.getViewModel(),
            entityStore = viewModel.getStore('entities'),
            domainTypeStore = viewModel.getStore('domainTypes');
        if (newValue) {
            viewModel.set('domainType', domainTypeStore.findRecord('type', newValue));
            PortalApp.data.authorization.DomainTypeApi.findSchemaByDomainType(
                {
                    domainType: newValue,
                    success: function (data) {
                        if (data && data.length > 0) {
                            viewModel.set('domainSchema', data);
                            const gridColumns = [];
                            for (let i = 0; i < data.length; i++) {
                                const fieldSchema = data[i],
                                    columnCfg = me.createColumnCfg(fieldSchema);
                                gridColumns.push(columnCfg);
                            }
                            grid.reconfigure(gridColumns);
                            entityStore.setDomainType(newValue);
                            entityStore.load();
                        }
                    }
                }
            );
        }
    },
    getModuleId: function () {
        return '';
    },
    onGrdItemDbClick: function (grid, record, item, index) {
        const view = this.getView(),
            viewModel = this.getViewModel(),
            moduleId = this.getModuleId(),
            domainType = viewModel.get('domainType'),
            type = domainType.get('type'),
            title = domainType.get('title'),
            domainSchema = viewModel.get('domainSchema'),
            entityId = record.get('id');
        view.fireEvent('switchview', {
            moduleId: moduleId,
            viewId: 'data-editor-' + type.replace(new RegExp('\\.', 'gm'), '-') + '-' + entityId,
            title: title,
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'console-authorization-data-editorview',
                domainType: domainType,
                domainSchema: domainSchema,
                entity: record
            },
        })
    },
    onGrdSelectionChange: function (sm, selections) {
        const view = this.getView(),
            btnRemove = view.down('button[handler=hBtnRemove]');
        if (selections.length) {
            btnRemove.enable();
        } else {
            btnRemove.disable();
        }
    },
    hBtnAdd: function (btn) {
        const view = this.getView(),
            viewModel = this.getViewModel(),
            moduleId = this.getModuleId(),
            domainType = viewModel.get('domainType'),
            type = domainType.get('type'),
            title = domainType.get('title'),
            domainSchema = viewModel.get('domainSchema');
        debugger
        view.fireEvent('switchview', {
            moduleId: moduleId,
            viewId: 'data-editor-' + type.replace(new RegExp('\\.', 'gm'), '-') + '-' + new Date(),
            title: title,
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'console-authorization-data-editorview',
                domainType: domainType,
                domainSchema: domainSchema,
                entity: null
            },
        })
    }
});
