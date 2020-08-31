Ext.define('PSR.clientSite.data.Ajax', {
    alternateClassName: ['PSR.clientSite.Ajax'],
    singleton: true,
    request: function (opt) {
        var authHeader = PSR.ClientSite.getAuthorizationHeader(function (authHeader) {
            PSR.clientSite.Ajax.request(opt);
        });
        if (authHeader) {
            opt.headers = Object.assign({}, authHeader, opt.headers);
            if (!opt.failure) {
                opt.failure = PSR.clientSite.data.Ajax.hCallFailure;
            }
            return PSR.Ajax.request(opt);
        }
    },
    hCallFailure: function (response, opt) {
        if (response) {
            if (response.status == '401') {
                PSR.Message.error("认证信息无效");
            } else {
                PSR.Message.error(response.statusText);
            }
            console.log(response);
        }
        if (opt.complete) {
            opt.complete(response, opt);
        }
    }
});
