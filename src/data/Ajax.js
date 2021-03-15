Ext.define('PSR.data.Ajax', {
    alternateClassName: ['PSR.Ajax'],
    singleton: true,
    request: function (opt) {
        if (!opt.success) {
            opt.success = PSR.Ajax.hCallSuccess;
        }
        if (!opt.failure) {
            opt.failure = PSR.Ajax.hCallFailure;
        }
        return Ext.Ajax.request(opt);
    },
    hCallSuccess: function (response, opt) {
        try {
            const respObj = response.responseJson
                || (response.responseText ? JSON.parse(response.responseText) : null);
            if (opt && opt.bizSuccess) {
                opt.bizSuccess(respObj, response, opt);
            }
            if (opt && opt.complete) {
                opt.complete(response, opt);
            }
        } catch (err) {
            if (opt.onErrorMessage) {
                opt.onErrorMessage(err.message);
            } else {
                PSR.Message.error(err);
            }
            console.error(err);
        }
    },
    hCallFailure: function (response, opt) {
        if (response) {
            console.log(response);
            if (response.status == '400') {
                if (opt.on400) {
                    opt.on400(response, opt);
                } else {
                    PSR.data.Ajax.on400(response, opt);
                }
            } else if (response.status == '401') {
                if (opt.on401) {
                    opt.on401(response, opt);
                } else {
                    PSR.data.Ajax.on401(response, opt);
                }
            } else if (response.status == '403') {
                PSR.Message.error('不允许访问')
            } else if (response.status >= 500 && response.status < 600) {
                if (opt.on50x) {
                    opt.on50x(response, opt);
                } else {
                    PSR.data.Ajax.on50x(response, opt);
                }
            } else if (response.statusText) {
                PSR.Message.error(response.statusText);
            } else {
                PSR.Message.error('调用失败');
            }
        }
        if (opt.complete) {
            opt.complete(response, opt);
        }
    },
    on400: function (response, opt) {
        const respObj = response.responseJson
            || (response.responseText ? JSON.parse(response.responseText) : null);
        if (respObj && respObj.message) {
            PSR.Message.error('<p><b>错误的请求: </b>' + respObj.exception + '</p><p>' + respObj.message + '</p>');
        } else {
            PSR.Message.error('错误的请求');
        }
    },
    on401: function (response, opt) {
        PSR.Message.error('授权信息无效');
    },
    on50x: function (response, opt) {
        const respObj = response.responseJson
            || (response.responseText ? JSON.parse(response.responseText) : null);
        if (respObj && respObj.message) {
            PSR.Message.error('<p><b>服务内部错误: </b>' + respObj.exception + '</p><p>' + respObj.message + '</p>');
        } else {
            PSR.Message.error('服务内部错误');
        }
    },
});
