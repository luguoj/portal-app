Ext.define('PortalApp.data.api.authorization.AuthorityApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/authorization/api/';
    },
    delete: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + 'authority/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
