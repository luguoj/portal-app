Ext.define('PortalApp.view.portalConsole.module.ResourceFileView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-resourcefileview',
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
            xtype: 'templatecolumn',
            width: 44,
            resizable: false,
            menuDisabled: true,
            tpl: [
                '<tpl if="this.isReady(file)">',
                '<div class="psr-cell-icon x-fa fa-check psr-color-confirm"></div>',
                '<tpl else>',
                '<div class="psr-cell-icon x-fa fa-times psr-color-decline"></div>',
                '</tpl>',
                {
                    isReady: function (file) {
                        return file && file.fileVersionId;
                    }
                }
            ],
            editRenderer: function () {
                return '';
            }
        }, {
            dataIndex: 'catalog',
            flex: 1,
            editor: {
                emptyText: '目录',
                allowBlank: false
            }
        }, {
            xtype: 'actioncolumn',
            width: 120,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove'
            }, {
                iconCls: 'x-fa fa-upload',
                altText: '上传',
                tooltip: '上传',
                handler: 'hBtnUpload',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('file') == undefined;
                }
            }, {
                iconCls: 'x-fa fa-download',
                altText: '下载',
                tooltip: '下载',
                handler: 'hBtnDownload',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('file') == undefined || !record.get('file').fileVersionId;
                }
            }, {
                iconCls: 'x-fa fa-file-archive',
                altText: '版本',
                tooltip: '版本',
                handler: 'hBtnVersion',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('file') == undefined || !record.get('file').fileVersionId;
                }
            }],
            editRenderer: function () {
                return '';
            }
        }],
        bind: {store: '{resourceFiles}'},
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
                resourceFileStore = this.getStore('resourceFiles');
            if (module) {
                resourceFileStore.addFilter(
                    {
                        property: 'moduleId',
                        operator: '==',
                        value: module.get('id')
                    }, true);
                resourceFileStore.load({
                    callback: function (records, operation, success) {
                        if (success && records && records.length) {
                            const resourceFileIdToRecordMap = {},
                                resourceFileIds = [];
                            for (let i = 0; i < records.length; i++) {
                                const record = records[i];
                                resourceFileIdToRecordMap[record.get('resourceFileId')] = record;
                                resourceFileIds.push(record.get('resourceFileId'));
                            }
                            PortalApp.data.api.entity.EntityCRUDApi.findAllById({
                                application: 'file',
                                domainType: 'org.psr.platform.file.entity.FileEntity',
                                ids: resourceFileIds,
                                success: function (data) {
                                    if (data && data.length > 0) {
                                        for (let i = 0; i < data.length; i++) {
                                            const datum = data[i],
                                                record = resourceFileIdToRecordMap[datum.id];
                                            if (record) {
                                                record.set('file', datum);
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    }
                });
            }
        },
        hBtnRefresh: function () {
            this.loadData();
        },
        hBtnAdd: function () {
            const view = this.getView(),
                resourceFileStore = this.getStore('resourceFiles'),
                plgRowediting = view.down('grid').findPlugin('rowediting'),
                newId = (new Date()).getTime();
            resourceFileStore.loadData([{id: newId, catalog: ''}], true);
            const record = resourceFileStore.findRecord('id', newId);
            record.set('catalog', 'file-' + newId);
            plgRowediting.startEdit(record);
        },
        onGrdEdit: function (editor, context) {
            const me = this,
                viewModel = this.getViewModel(),
                module = viewModel.get('module'),
                record = context.record,
                newValues = {
                    catalog: context.newValues.catalog
                };
            if (record.get('version') == undefined) {
                Object.assign(
                    newValues,
                    {
                        moduleId: module.get('id')
                    }
                );
                PortalApp.data.api.portal.ModuleApi.createResource({
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
                    domainType: 'org.psr.platform.portal.entity.ModuleResourceEntity',
                    fields: ['catalog'],
                    values: newValues,
                    success: function (data) {
                        PSR.util.Message.info('保存成功');
                        me.loadData();
                    }
                })
            }
        },
        hBtnRemove: function (grid, rowIndex) {
            const me = this,
                view = this.getView();
                resourceFileStore = this.getStore('resourceFiles'),
                record = grid.getStore().getAt(rowIndex);
            if (record.get('version') == undefined) {
                resourceFileStore.remove(record);
            } else {
                PSR.util.Message.confirm('删除模块资源:' + record.get('catalog'), function () {
                    view.mask('处理中...');
                    PortalApp.data.api.portal.ModuleApi.deleteResource({
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
        hBtnUpload: function (grid, rowIndex) {
            const me = this,
                record = grid.getStore().getAt(rowIndex),
                dialog = PSR.Dialog.upload({
                    uploadHandler: function (file) {
                        PortalApp.data.api.entity.EntityCRUDApi.findAllById({
                            application: 'file',
                            domainType: 'org.psr.platform.file.entity.FileEntity',
                            ids: [record.get('resourceFileId')],
                            success: function (data) {
                                if (data && data.length > 0) {
                                    const fileEntity = data[0];
                                    PortalApp.data.api.file.FileApi.upload({
                                        id: fileEntity.id,
                                        version: fileEntity.version,
                                        file: file,
                                        success: function (data) {
                                            dialog.close();
                                            me.loadData();
                                        }
                                    });
                                }
                            }
                        })
                    }
                });
        },
        hBtnVersion: function (grid, rowIndex) {
            const view = this.getView(),
                record = grid.getStore().getAt(rowIndex),
                fileId = record.get('resourceFileId');
            view.fireEvent('switchview', {
                viewId: 'fileconsole-versionview-' + fileId,
                title: '文件版本',
                iconCls: 'x-fa fa-edit',
                viewConfig: {
                    xtype: 'fileconsole-versionview',
                    fileId: fileId
                },
            })
        },
        hBtnDownload: function (grid, rowIndex) {
            const record = grid.getStore().getAt(rowIndex);
            PortalApp.data.api.file.FileApi.download({
                id: record.get('resourceFileId')
            });
        }
    },
    viewModel: {
        data: {
            module: null
        },
        stores: {
            resourceFiles: {
                fields: ['id', 'version', 'moduleId', 'resourceFileId', 'catalog', 'file'],
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleResourceEntity',
                pageSize: 0,
                remoteFilter: true,
                remoteSort: true,
                autoLoad: false,
                sorters: [{property: 'catalog', direction: 'ASC'}]
            }
        }
    }
});