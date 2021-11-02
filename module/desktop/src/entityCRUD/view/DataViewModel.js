Ext.define('PSR.view.entityCRUD.data.DataViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.psr-entitycrud-dataviewmodel',
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
            type: 'psr-domainschema-domaintype',
            autoLoad: true
        },
        entities: {
            type: 'psr-entitycrud-entity',
            pageSize: 50,
            remoteSort: true,
            remoteFilter: true,
            autoLoad: false
        }
    }
});
