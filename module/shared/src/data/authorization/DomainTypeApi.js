Ext.define('PortalApp.data.authorization.DomainTypeApi', {
    singleton: true,
    findSchemaByDomainType: function (opt) {
        const domainType = opt.domainType;
        PSR.data.Ajax.request({
            method: 'GET',
            url: window.portalEnv.gateway + '/authorization/api/domain_schema/' + domainType,
            withCredentials: true,
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    }
});
