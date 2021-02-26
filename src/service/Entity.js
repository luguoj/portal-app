Ext.define('PSR.service.Entity', {
    extend: 'PSR.service.Service',
    findById: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'GET',
            url: this.getUrlPrefix() + '/' + opt.id,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
        });
    },
    search: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'GET',
            url: this.getUrlPrefix(),
            params: {searchParams: JSON.stringify(opt.searchParams)},
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
            url: this.getUrlPrefix(),
            jsonData: opt.values,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
        });
    },
    update: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'PUT',
            url: this.getUrlPrefix() + '/' + opt.values.id,
            jsonData: opt.values,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
        });
    },
    patch: function (opt) {
        let props = [];
        for (const valueKey in opt.value) {
            if (valueKey != 'id') {
                props.push(valueKey);
            }
        }
        PSR.clientSite.Ajax.request({
            method: 'PATCH',
            url: this.getUrlPrefix() + '/' + opt.values.id,
            params: {props: props.join(',')},
            jsonData: opt.values,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
        });
    },
    delete: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'DELETE',
            url: this.getUrlPrefix() + '/' + opt.id,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete,
            onErrorMessage: opt.onErrorMessage
        });
    }
});
