Ext.define('PortalApp.view.entityConsole.EntityConsoleViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.entityconsoleviewmodel',
    config: {
        application: '',
    },
    constructor: function (config) {
        this.callParent([config]);
        this.updateApplication();
    },
    updateApplication: function () {
        const application = this.getApplication(),
            domainTypeStore = this.getStore('domainTypes'),
            entityStore = this.getStore('entities');
        if (domainTypeStore) {
            domainTypeStore.setApplication(application);
        }
        if (entityStore) {
            entityStore.setApplication(application);
        }
    },
    data: {
        domainType: null,
        domainSchema: null
    },
    stores: {
        domainTypes: {
            type: 'domaintype',
            autoLoad: true
        },
        entities: {
            type: 'entity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false
        }
    }
});
