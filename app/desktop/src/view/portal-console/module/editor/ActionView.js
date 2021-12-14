Ext.define('PortalApp.view.portalConsole.module.ActionView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-actionview',
    config: {
        module: null
    },
    bubbleEvents: ['switchview'],
    layout: 'fit',
    tools: [{
        iconCls: 'x-fa fa-redo-alt',
        handler: 'hBtnRefresh',
        bind: {disabled: '{!module}'}
    }, {
        iconCls: 'x-fa fa-plus-circle',
        handler: 'hBtnAdd',
        bind: {disabled: '{!module}'}
    }],
    items: [{
        xtype: 'grid',
        reference: 'grd-resources',
        columnLines: true,
        minHeight: 100,
        disableSelection: true,
        plugins: {
            rowediting: {
                clicksToMoveEditor: 1,
                autoCancel: false
            }
        },
        hideHeaders: true,
        columns: [{
            xtype: 'checkcolumn',
            width: 40,
            dataIndex: 'enabled',
            disabled: true,
            editor: {
                xtype: 'psr-checkboxfield'
            }
        }, {
            dataIndex: 'code',
            flex: 1,
            editor: {
                emptyText: '编码',
                allowBlank: false
            }
        }, {
            dataIndex: 'description',
            flex: 1,
            editor: {
                emptyText: '描述',
                allowBlank: false
            }
        }, {
            xtype: 'actioncolumn',
            width: 40,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove'
            }],
            editRenderer: function () {
                return '';
            }
        }],
        bind: {store: '{actions}'},
        listeners: {
            edit: 'onGrdEdit'
        }
    }],
    updateModule: function (module) {
        this.getViewModel().set('module', module);
        this.getController().loadData();
    },
    controller: {
        loadData: function () {
            const viewModel = this.getViewModel(),
                module = viewModel.get('module'),
                actionStore = this.getStore('actions');
            if (module) {
                actionStore.addFilter(
                    {
                        property: 'moduleId',
                        operator: '==',
                        value: module.get('id')
                    }, true);
                actionStore.load();
            }
        },
        hBtnRefresh: function () {
            this.loadData();
        },
        hBtnAdd: function () {
            const view = this.getView(),
                actionStore = this.getStore('actions'),
                plgRowediting = view.down('grid').findPlugin('rowediting'),
                newId = (new Date()).getTime();
            actionStore.loadData([{id: newId, code: '', description: ''}], true);
            const record = actionStore.findRecord('id', newId);
            record.set('code', 'action-' + newId);
            record.set('description', '操作-' + newId);
            plgRowediting.startEdit(record);
        },
        onGrdEdit: function (editor, context) {
            const me = this,
                viewModel = this.getViewModel(),
                module = viewModel.get('module'),
                record = context.record,
                newValues = {
                    enabled: context.newValues.enabled,
                    code: context.newValues.code,
                    description: context.newValues.description
                };
            if (record.get('version') == undefined) {
                Object.assign(
                    newValues,
                    {
                        moduleId: module.get('id')
                    }
                );
                PortalApp.data.api.entity.EntityCRUDApi.create({
                    application: 'portal',
                    domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                    values: newValues,
                    success: function (data) {
                        PSR.util.Message.info('保存成功');
                        me.loadData();
                    }
                })
            } else {
                Object.assign(
                    newValues,
                    {
                        id: record.get('id'),
                        version: record.get('version')
                    }
                );
                PortalApp.data.api.entity.EntityCRUDApi.patch({
                    application: 'portal',
                    domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                    fields: ['enabled', 'code', 'description'],
                    values: newValues,
                    success: function (data) {
                        PSR.util.Message.info('保存成功');
                        me.loadData();
                    }
                })
            }
        },
        hBtnEnabled: function (btn, e) {
            const me = this,
                record = btn.lookupViewModel().get('record'),
                fields = ['enabled'],
                values = {
                    id: record.get('id'),
                    version: record.get('version'),
                    enabled: !record.get('enabled')
                };
            PortalApp.data.api.entity.EntityCRUDApi.patch({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                fields: fields,
                values: values,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            });
        },
        hBtnRemove: function (grid, rowIndex) {
            const me = this,
                view = this.getView(),
                actionStore = this.getStore('actions'),
                record = grid.getStore().getAt(rowIndex);
            if (record.get('version') == undefined) {
                actionStore.remove(record);
            } else {
                PSR.util.Message.confirm('删除模块操作:' + record.get('code'), function () {
                    view.mask('处理中...');
                    PortalApp.data.api.portal.ModuleApi.deleteAction({
                        id: record.get('id'),
                        success: function () {
                            me.loadData();
                            view.unmask();
                            PSR.util.Message.info('删除成功');
                        }
                    });
                });
            }
        },
    },
    viewModel: {
        data: {
            module: null
        },
        stores: {
            actions: {
                fields: ['id', 'version', 'moduleId', 'code', 'description', 'enabled'],
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                pageSize: 0,
                remoteFilter: true,
                remoteSort: true,
                autoLoad: false,
                sorters: [{property: 'code', direction: 'ASC'}]
            }
        }
    }
});