Ext.define('PSR.view.entityCRUD.data.DataViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.psr-entitycrud-dataviewcontroller',
    config: {
        application: ''
    },
    createColumnCfg: function (fieldSchema) {
        const fieldType = fieldSchema.type,
            columnCfg = {
                dataIndex: fieldSchema.name,
                text: fieldSchema.description
            };
        if (fieldSchema.name == 'version' || fieldSchema.name == 'createdDate' || fieldSchema.name == 'lastModifiedDate') {
            columnCfg.hidden = true;
        }
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
            application = this.getApplication(),
            view = this.getView(),
            filterForm = view.down('container[region=west]'),
            grid = view.down('grid'),
            viewModel = this.getViewModel(),
            entityStore = viewModel.getStore('entities'),
            domainTypeStore = viewModel.getStore('domainTypes');
        entityStore.clearFilter(true);
        entityStore.getSorters().removeAll();
        if (newValue) {
            viewModel.set('domainType', domainTypeStore.findRecord('type', newValue));
            PSR.data.entityCRUD.DomainTypeApi.findSchemaByDomainType(
                {
                    application: application,
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
            application = this.getApplication(),
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
                xtype: 'psr-view-entitycrud-data-editorview',
                mode:'editing',
                application: application,
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
            application = this.getApplication(),
            domainType = viewModel.get('domainType'),
            type = domainType.get('type'),
            title = domainType.get('title'),
            domainSchema = viewModel.get('domainSchema');
        view.fireEvent('switchview', {
            moduleId: moduleId,
            viewId: 'data-editor-' + type.replace(new RegExp('\\.', 'gm'), '-') + '-' + Date.parse(new Date()),
            title: title,
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'psr-view-entitycrud-data-editorview',
                mode: 'creating',
                application: application,
                domainType: domainType,
                domainSchema: domainSchema,
                entity: null
            },
        })
    }
});
