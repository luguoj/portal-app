Ext.define('PortalApp.view.portalConsole.ModuleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.portalconsole-moduleviewmodel',
    stores: {
        modules: {
            type: 'entity',
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.ModuleEntity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: true
        }
    }
});
