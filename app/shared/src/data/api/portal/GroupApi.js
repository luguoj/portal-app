Ext.define('PortalApp.data.api.portal.GroupApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/portal/api/';
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
    }
});
