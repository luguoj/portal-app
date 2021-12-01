Ext.define('PSR.data.api.entity.DomainSchemaApi', {
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
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
