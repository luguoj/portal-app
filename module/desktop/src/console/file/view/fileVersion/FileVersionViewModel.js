Ext.define('PSR.view.console.file.FileVersionViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.psr-console-file-fileversionviewmodel',
    stores: {
        fileVersions: {
            type: 'psr-entitycrud-entity',
            application: 'file',
            domainType: 'org.psr.platform.file.entity.FileVersionEntity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false
        }
    }
});
