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
    hBtnDownload: function (btn) {
        const rec = btn.lookupViewModel().get('record');
        PSR.data.api.file.FileVersionApi.download({
            id: rec.get('fileId')
        });
    }
});
