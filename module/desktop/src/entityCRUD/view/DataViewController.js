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
                text: fieldSchema.description,
                width: PSR.util.Grid.getColumnWidth(fieldSchema.description)
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
                    width: Math.max(columnCfg.width, PSR.util.Grid.getColumnWidth('0000-00-00 00:00:00.000')),
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
                    width: Math.max(columnCfg.width, PSR.util.Grid.getColumnWidth('是')),
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
            PSR.data.domainSchema.DomainSchemaApi.findSchemaByDomainType(
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
    onGrdItemDbClick: function (grid, record, item, index) {
        const view = this.getView(),
            viewModel = this.getViewModel(),
            application = this.getApplication(),
            domainType = viewModel.get('domainType'),
            type = domainType.get('type'),
            title = domainType.get('title'),
            domainSchema = viewModel.get('domainSchema'),
            entityId = record.get('id');
        view.fireEvent('switchview', {
            viewId: 'data-editor-' + type.replace(new RegExp('\\.', 'gm'), '-') + '-' + entityId,
            title: title,
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'psr-view-entitycrud-data-editorview',
                mode: 'editing',
                application: application,
                domainType: domainType,
                domainSchema: domainSchema,
                entityId: record.get('id')
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
            application = this.getApplication(),
            domainType = viewModel.get('domainType'),
            type = domainType.get('type'),
            title = domainType.get('title'),
            domainSchema = viewModel.get('domainSchema');
        view.fireEvent('switchview', {
            viewId: 'data-editor-' + type.replace(new RegExp('\\.', 'gm'), '-') + '-' + Date.parse(new Date()),
            title: title,
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'psr-view-entitycrud-data-editorview',
                mode: 'creating',
                application: application,
                domainType: domainType,
                domainSchema: domainSchema,
                entityId: null
            },
        })
    },
    hBtnRemove: function (btn) {
        const view = this.getView(),
            application = this.getApplication(),
            grid = view.down('grid'),
            selections = grid.getSelection(),
            viewModel = this.getViewModel(),
            domainType = viewModel.get('domainType').get('type'),
            entityStore = viewModel.getStore('entities');
        if (selections && selections.length > 0) {
            PSR.util.Message.confirm('删除' + selections.length + '条数据', function () {
                btn.setDisabled(true);
                const ids = [];
                for (let i = 0; i < selections.length; i++) {
                    const selection = selections[i];
                    ids.push(selection.get('id'));
                }
                PSR.data.entityCRUD.EntityCRUDApi.delete({
                    application: application,
                    domainType: domainType,
                    ids: ids,
                    success: function () {
                        PSR.util.Message.info('删除成功');
                    },
                    complete: function () {
                        entityStore.load();
                    }
                });
            });
        }
    },
    onCombPageLimitChange: function (comb, newValue) {
        const viewModel = this.getViewModel(),
            entityStore = viewModel.getStore('entities');
        entityStore.setPageSize(newValue);
        if (entityStore.isLoaded()) {
            entityStore.loadPage(1);
        }
    }
});
