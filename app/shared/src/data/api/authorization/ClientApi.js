Ext.define('PortalApp.data.api.authorization.ClientApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/authorization/api/';
    },
    resetPassword: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'POST',
            url: url + 'client/' + opt.id + '/reset_password',
            withAuthToken: true,
            success: function (response) {
                if (opt.success) {
                    opt.success(response.responseText);
                }
                if (opt.complete) {
                    opt.complete();
                }
            },
            failure: opt.failure,
            complete: opt.complete
        });
    },
    delete: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + 'client/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
