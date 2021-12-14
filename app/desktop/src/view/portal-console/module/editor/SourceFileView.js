Ext.define('PortalApp.view.portalConsole.module.SourceFileView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-sourcefileview',
    config: {
        module: null
    },
    bubbleEvents: ['switchview'],
    layout: 'fit',
    tools: [{
        iconCls: 'x-fa fa-redo-alt',
        handler: 'hBtnRefresh',
        bind: {disabled: '{!module}'}
    }],
    items: [{
        xtype: 'grid',
        disableSelection: true,
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
        }, {
            dataIndex: 'text',
            flex: 1
        }, {
            xtype: 'actioncolumn',
            width: 93,
            resizable: true,
            menuDisabled: true,
            items: [{
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
            }]
        }],
        bind: {
            store: '{sourceFiles}'
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
                sourceFileStore = this.getStore('sourceFiles'),
                scriptFileRecord = sourceFileStore.findRecord('id', 'script'),
                styleFileRecord = sourceFileStore.findRecord('id', 'style');
            if (module) {
                PortalApp.data.api.entity.EntityCRUDApi.findAllById({
                    application: 'file',
                    domainType: 'org.psr.platform.file.entity.FileEntity',
                    ids: [module.get('scriptFileId'), module.get('styleFileId')],
                    success: function (data) {
                        if (data && data.length > 0) {
                            for (let i = 0; i < data.length; i++) {
                                const datum = data[i];
                                if (datum.id == module.get('scriptFileId')) {
                                    scriptFileRecord.set('file', datum);
                                } else if (datum.id == module.get('styleFileId')) {
                                    styleFileRecord.set('file', datum);
                                }
                            }
                        }
                    }
                })
            }
        },
        hBtnRefresh: function () {
            this.loadData();
        },
        hBtnUpload: function (grid, rowIndex) {
            const me = this,
                record = grid.getStore().getAt(rowIndex),
                fileEntity = record.get('file'),
                dialog = PSR.Dialog.upload({
                    accept: record.get('accept'),
                    uploadHandler: function (file) {
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
                });
        },
        hBtnVersion: function (grid, rowIndex) {
            const view = this.getView(),
                record = grid.getStore().getAt(rowIndex),
                fileEntity = record.get('file');
            view.fireEvent('switchview', {
                viewId: 'fileconsole-versionview-' + fileEntity.id,
                title: '文件版本',
                iconCls: 'x-fa fa-edit',
                viewConfig: {
                    xtype: 'fileconsole-versionview',
                    fileId: fileEntity.id
                },
            })
        },
        hBtnDownload: function (grid, rowIndex) {
            const record = grid.getStore().getAt(rowIndex),
                fileEntity = record.get('file');
            PortalApp.data.api.file.FileApi.download({
                id: fileEntity.id
            });
        }
    },
    viewModel: {
        data: {
            module: null
        },
        stores: {
            sourceFiles: {
                data: [
                    {id: 'script', text: '脚本', accept: '.js'},
                    {id: 'style', text: '样式', accept: '.css'}
                ]
            }
        }
    }
});