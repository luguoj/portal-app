Ext.define('PSR.util.Module', {
    singleton: true,
    loadSrc: function (opt) {
        const moduleSrcUrl = window.moduleSite + '/module/' + opt.moduleId + '/index.js?v=' + (new Date()).getTime();
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
    loadAction: function (opt) {
        PSR.Ajax.request({
            method: 'GET',
            url: window.gatewaySite + '/extapp/api/desktop/module_action/',
            params: {
                moduleId: opt.moduleId
            },
            withCredentials: true,
            withAuthToken: true,
            disableCaching: true,
            bizSuccess: opt.success,
            failure: opt.failure,
            complete: opt.complete
        });
    }
});