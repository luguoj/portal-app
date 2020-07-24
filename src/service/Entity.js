Ext.define('PSR.service.Entity', {
    config: {
        getContextPath: function () {
            return '';
        },
        getApiPath: function () {
            return '';
        }
    },
    getUrlPrefix: function () {
        return window.gatewaySite +this.getContextPath() + this.getApiPath();
    },
    load: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'GET',
            url: this.getUrlPrefix() + '/load',
            params: {id: opt.id},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
    loadByIds: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'GET',
            url: this.getUrlPrefix() + '/load',
            params: {ids: opt.ids},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    }
});
