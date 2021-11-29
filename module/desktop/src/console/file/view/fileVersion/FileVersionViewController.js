Ext.define('PSR.view.console.file.FileVersionViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.psr-console-file-fileversionviewcontroller',
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
        PSR.data.file.FileVersionApi.download({
            id: rec.get('fileId')
        });
    }
});
