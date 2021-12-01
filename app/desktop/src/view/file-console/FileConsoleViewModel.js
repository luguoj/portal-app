Ext.define('PortalApp.view.fileConsole.FileConsoleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fileconsoleviewmodel',
    stores: {
        files: {
            type: 'psr-entity',
            application: 'file',
            domainType: 'org.psr.platform.file.entity.FileEntity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false
        }
    }
});
