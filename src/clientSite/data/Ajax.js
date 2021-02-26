Ext.define('PSR.clientSite.data.Ajax', {
    alternateClassName: ['PSR.clientSite.Ajax'],
    singleton: true,
    request: function (opt) {
        if (!opt.on401) {
            opt.on401 = PSR.clientSite.data.Ajax.on401;
        }
        var authHeader = PSR.ClientSite.getAuthorizationHeader(function (authHeader) {
            PSR.clientSite.Ajax.request(opt);
        });
        if (authHeader) {
            opt.headers = Object.assign({}, authHeader, opt.headers);
            return PSR.Ajax.request(opt);
        }
    },
    on401: function (response, opt) {
        PSR.ClientSite.clientToken.expires_at = 1;
        if (!opt.retryTimes || opt.retryTimes < 5) {
            opt.retryTimes = opt.retryTimes ? opt.retryTimes + 1 : 1;
            setTimeout(function () {
                PSR.clientSite.data.Ajax.request(opt);
            }, 500);
            return;
        } else {
            delete opt.retryTimes;
            PSR.Message.error("授权信息无效");
        }
    }
});
