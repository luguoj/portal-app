Ext.define('PortalApp.view.fileConsole.VersionViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.fileconsole-versionviewmodel',
    stores: {
        fileVersions: {
            type: 'entity',
            application: 'file',
            domainType: 'org.psr.platform.file.entity.FileVersionEntity',
            pageSize: 50,
            remoteSort: true,
            autoLoad: false
        }
    }
});
