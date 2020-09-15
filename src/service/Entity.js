Ext.define('PSR.service.Entity', {
    extend: 'PSR.service.Service',
    load: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'GET',
            url: this.getUrlPrefix() + '/load',
            params: {id: opt.id},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
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
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
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
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
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
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
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
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
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
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
        });
    },
});
