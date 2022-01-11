Ext.define('PortalApp.data.api.portal.UserProfileApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/portal/api/';
    },
    module: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'GET',
            url: url + 'user_profile/module/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    portal: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'GET',
            url: url + 'user_profile/portal/' + window.portalEnv.portalCode + '-' + window.portalEnv.profile,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
