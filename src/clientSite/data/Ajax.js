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
            console.log(response);
            if (response.status == '401') {
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
            } else if (response.status == '403') {
                PSR.Message.error("不允许访问")
            } else if(response.statusText){
                PSR.Message.error(response.statusText);
            } else {
                PSR.Message.error('调用失败');
            }
        }
        if (opt.complete) {
            opt.complete(response, opt);
        }
    }
});
