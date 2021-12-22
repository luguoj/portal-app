Ext.define('PortalApp.data.api.authorization.UserApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/authorization/api/';
    },
    resetPassword: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'POST',
            url: url + 'user/' + opt.id + '/reset_password',
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
    remove: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + 'user/' + opt.id,
            withAuthToken: true,
            success: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
