Ext.define('PSR.view.console.file.FileViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.psr-console-file-fileviewmodel',
    stores: {
        files: {
            type: 'psr-entitycrud-entity',
            application: 'file',
            domainType: 'org.psr.platform.file.entity.FileEntity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false
        }
    }
});
