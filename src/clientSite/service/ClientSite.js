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
        scriptEl.onload = scriptEl.onreadystateschange = function () {
            if (!this.readyState
                || this.readyState == 'loaded' || this.readyState == 'complete') {
                if (opt.success) {
                    opt.success();
                }
                if (opt.complete) {
                    opt.complete();
                }
            }
        };
        scriptEl.src = moduleSrcUrl;
        document.body.appendChild(scriptEl);
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
