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
    },
    create: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'POST',
            url: this.getUrlPrefix() + '/create',
            params: opt.values,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
    update: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'POST',
            url: this.getUrlPrefix() + '/update',
            params: opt.values,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
    delete: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'POST',
            url: this.getUrlPrefix() + '/delete',
            params: {id: opt.id},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
    clone: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'POST',
            url: this.getUrlPrefix() + '/clone',
            params: {id: opt.id},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
});
