Ext.define('PortalApp.view.fileConsole.FileConsoleViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileconsoleviewcontroller',
    hBtnDownload: function (grid, rowIndex) {
        const record = grid.getStore().getAt(rowIndex);
        PortalApp.data.api.file.FileApi.download({
            id: record.get('id')
        });
    },
    hBtnVersion: function (grid, rowIndex) {
        const view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'fileconsole-versionview-' + record.get('id'),
            title: '文件版本',
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'fileconsole-versionview',
                fileId: record.get('id')
            },
        })
    }
});
