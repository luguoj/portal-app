Ext.define('PortalApp.view.fileConsole.VersionViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.fileconsole-versionviewcontroller',
    onCombPageLimitChange: function (comb, newValue) {
        const viewModel = this.getViewModel(),
            fileStore = viewModel.getStore('fileVersions');
        fileStore.setPageSize(newValue);
        if (fileStore.isLoaded()) {
            fileStore.loadPage(1);
        }
    },
    hBtnDownload: function (grid, rowIndex) {
        const record = grid.getStore().getAt(rowIndex);
        PSR.data.api.file.FileApi.downloadVersion({
            id: record.get('id')
        });
    }
});
