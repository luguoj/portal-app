Ext.define('PSR.clientSite.service.ClientSite', {
    singleton: true,
    loadToken: function (opt) {
        PSR.Ajax.request({
            method: 'POST',
            url: window.clientSite + '/token',
            withCredentials: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    },
    loadModuleSrc: function (opt) {
        const moduleSrcUrl = window.moduleSite + '/module/' + opt.moduleId + '/index.js';
        const scriptEl = document.createElement('script');
        scriptEl.src = moduleSrcUrl;
        document.body.appendChild(scriptEl);
        if (opt.success) {
            opt.success();
        }
        if (opt.complete) {
            opt.complete();
        }
    },
    loadModuleAction: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'GET',
            url: window.gatewaySite + '/extapp/api/desktop/module_action/',
            params: {
                moduleId: opt.moduleId
            },
            withCredentials: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});
