Ext.define('PortalApp.data.api.authorization.GroupApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/authorization/api/';
    },
    delete: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + 'group/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    clone: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'POST',
            url: url + 'group/clone',
            params: {
                id: opt.id
            },
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
