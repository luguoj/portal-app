Ext.define('PSR.view.console.file.FileViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.psr-console-file-fileviewcontroller',
    hBtnDownload: function (btn) {
        const rec = btn.lookupViewModel().get('record');
        PSR.data.file.FileVersionApi.download({
            id: rec.get('fileMetaId')
        });
        PSR.data.entityCRUD.EntityCRUDApi.findAllById({
            application: 'file',
            domainType: 'org.psr.platform.file.entity.FileMetaEntity',
            ids: [rec.get('fileMetaId')],
            success: function (data) {
                if (data && data.length > 0) {
                    PSR.data.file.FileVersionApi.download({
                        id: data[0].id
                    });
                }
            }
        });
    },
    hBtnVersion: function (btn) {
        const view = this.getView();
        const rec = btn.lookupViewModel().get('record');
        view.fireEvent('switchview', {
            viewId: 'psr-view-console-file-filemetaview-' + rec.get('id'),
            title: '文件版本',
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'psr-view-console-file-filemetaview',
                fileId: rec.get('id')
            },
        })
    }
});
