Ext.define('PSR.clientSite.service.ClientSite', {
    singleton: true,
    loadToken: function (opt) {
        PSR.Ajax.request({
            method: 'POST',
            url: window.clientSite + '/token',
            withCredentials: true,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
    loadModuleSrc: function (opt) {
        Ext.Ajax.request({
            url: window.clientSite + '/module/' + opt.moduleId + '/index.js',
            method: 'GET',
            disableCaching: true,
            success: function (response) {
                const responseText = response.responseText;
                try {
                    (new Function(responseText))();
                    if (opt.success) {
                        opt.success(response);
                    }
                } catch (err) {
                    PSR.Message.error(err);
                    console.error(err);
                    if (opt.failure) {
                        opt.failure(response, err);
                    }
                }
                if (opt.complete) {
                    opt.complete();
                }
            },
            failure: function (response) {
                if (opt.failure) {
                    opt.failure(response);
                }
                if (opt.complete) {
                    opt.complete();
                }
            }
        });
    },
    loadModuleAction: function (opt) {
        PSR.Ajax.request({
            method: 'GET',
            url: window.clientSite + '/moduleAction',
            params: {
                moduleId: opt.moduleId
            },
            withCredentials: true,
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    }
});