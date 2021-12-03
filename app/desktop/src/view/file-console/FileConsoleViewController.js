Ext.define('PortalApp.view.fileConsole.FileConsoleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileconsoleviewcontroller',
    hBtnDownload: function (grid, rowIndex) {
        const rec = grid.getStore().getAt(rowIndex);
        PSR.data.api.file.FileVersionApi.download({
            id: rec.get('fileMetaId')
        });
    },
    hBtnVersion: function (grid, rowIndex) {
        const view = this.getView(),
            rec = grid.getStore().getAt(rowIndex);
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
