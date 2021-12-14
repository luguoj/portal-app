Ext.define('PortalApp.view.portalConsole.module.ResourceFileViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-module-editor-resourcefileviewcontroller',
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
});