Ext.define('PortalApp.data.api.organization.OrganizationApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/organization/api/';
    },
    create: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'POST',
            url: url + 'organization',
            params: opt.values,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    delete: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + 'organization/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
