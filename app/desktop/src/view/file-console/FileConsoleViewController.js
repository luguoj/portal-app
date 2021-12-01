Ext.define('PortalApp.view.fileConsole.FileConsoleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileconsoleviewcontroller',
    hBtnDownload: function (btn) {
        const rec = btn.lookupViewModel().get('record');
        PSR.data.api.file.FileVersionApi.download({
            id: rec.get('fileMetaId')
        });
    },
    hBtnVersion: function (btn) {
        const view = this.getView();
        const rec = btn.lookupViewModel().get('record');
        view.fireEvent('switchview', {
            viewId: 'fileconsole-versionview-' + rec.get('id'),
            title: '文件版本',
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'fileconsole-versionview',
                fileId: rec.get('id')
            },
        })
    }
});
