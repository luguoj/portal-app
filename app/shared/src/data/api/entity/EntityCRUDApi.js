Ext.define('PortalApp.data.api.entity.EntityCRUDApi', {
    singleton: true,
    getAPIUrl: function (opt) {
        const application = opt.application,
            domainType = opt.domainType;
        return window.portalEnv.gateway + '/' + application + '/api/entity/' + domainType;
    },
    findAllById: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'GET',
            url: url + '/' + opt.ids.join(','),
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    create: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'POST',
            url: url,
            jsonData: opt.values,
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    update: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'PUT',
            url: url + '/' + opt.values.id,
            jsonData: opt.values,
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    patch: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'PATCH',
            url: url + '/' + opt.values.id + '/' + opt.fields.join(','),
            jsonData: opt.values,
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    delete: function (opt) {
        const url = this.getAPIUrl(opt);
        PSR.data.Ajax.request({
            method: 'DELETE',
            url: url + '/' + opt.ids.join(','),
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
