Ext.define('PSR.data.entityCRUD.DomainTypeApi', {
    singleton: true,
    findSchemaByDomainType: function (opt) {
        const domainType = opt.domainType,
            application = opt.application;
        PSR.data.Ajax.request({
            method: 'GET',
            url: window.portalEnv.gateway + '/' + application + '/api/domain_schema/' + domainType,
            withCredentials: true,
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    }
});
