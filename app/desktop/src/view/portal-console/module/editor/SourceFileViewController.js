Ext.define('PortalApp.view.portalConsole.module.SourceFileViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-module-editor-sourcefileviewcontroller',
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
});