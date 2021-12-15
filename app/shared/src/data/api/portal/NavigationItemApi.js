Ext.define('PortalApp.data.api.portal.NavigationItemApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/portal/api/';
    },
    delete: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + 'navigation_item/' + opt.id,
            withAuthToken: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
