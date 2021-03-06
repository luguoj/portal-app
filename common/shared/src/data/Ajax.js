Ext.define('PSR.data.Ajax', {
    singleton: true,
    request: function (opt) {
        if (!opt.success) {
            opt.success = PSR.data.Ajax.hCallSuccess;
        }
        if (!opt.failure) {
            opt.failure = PSR.data.Ajax.hCallFailure;
        }
        if (opt.withAuthToken) {
            var authHeader = PSR.util.Auth.getAuthorizationHeader(function (authHeader) {
                PSR.data.Ajax.request(opt);
            });
            if (!authHeader) {
                return;
            }
            opt.headers = Object.assign({}, opt.headers, authHeader);
        }
        return Ext.Ajax.request(opt);
    },
    onErrorMessage: function (message, opt) {
        if (opt && opt.onErrorMessage) {
            opt.onErrorMessage(message);
        } else {
            PSR.util.Message.error(message);
        }
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
            PSR.data.Ajax.onErrorMessage(err.message, opt);
            console.error(err);
        }
        if (opt.retryTimes) {
            delete opt.retryTimes;
        }
        if (opt.retryMessage) {
            opt.retryMessage.close();
            delete opt.retryMessage;
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
                PSR.data.Ajax.onErrorMessage('???????????????', opt);
            } else if (response.status == '503') {
                PSR.data.Ajax.onErrorMessage('???????????????', opt);
            } else if (response.status >= 500 && response.status < 600) {
                if (opt.on50x) {
                    opt.on50x(response, opt);
                } else {
                    PSR.data.Ajax.on50x(response, opt);
                }
            } else if (response.statusText) {
                PSR.data.Ajax.onErrorMessage(response.statusText, opt);
            } else {
                PSR.data.Ajax.onErrorMessage('????????????', opt);
            }
        }
        if (opt.complete) {
            opt.complete(response, opt);
        }
        if (response.status != '401') {
            if (opt.retryTimes) {
                delete opt.retryTimes;
            }
            if (opt.retryMessage) {
                opt.retryMessage.close();
                delete opt.retryMessage;
            }
        }
    },
    on400: function (response, opt) {
        const respObj = response.responseJson
            || (response.responseText ? JSON.parse(response.responseText) : null);
        if (respObj && respObj.message) {
            PSR.data.Ajax.onErrorMessage('<b>???????????????</b>: ' + respObj.exception + ', ' + respObj.message, opt);
        } else {
            PSR.data.Ajax.onErrorMessage('???????????????', opt);
        }
    },
    on401: function (response, opt) {
        if (opt.withAuthToken) {
            PSR.util.Auth.clientToken.expires_at = 1;
            if (!opt.retryTimes || opt.retryTimes < 10) {
                opt.retryTimes = opt.retryTimes ? opt.retryTimes + 1 : 1;
                console.warn('??????????????????,????????????...' + opt.retryTimes);
                opt.retryMessage = opt.retryMessage || Ext.Msg.show({
                    title: '???????????????...',
                    progress: true,
                    closable: false
                });
                setTimeout(function () {
                    opt.retryMessage.updateProgress(0.1 * opt.retryTimes);
                    PSR.data.Ajax.request(opt);
                }, 200);
                return;
            }
        }
        PSR.data.Ajax.onErrorMessage('??????????????????', opt);
    },
    on50x: function (response, opt) {
        const respObj = response.responseJson
            || (response.responseText ? JSON.parse(response.responseText) : null);
        if (respObj && respObj.message) {
            PSR.data.Ajax.onErrorMessage('<b>??????????????????</b>: ' + respObj.exception + ', ' + respObj.message, opt);
        } else {
            PSR.data.Ajax.onErrorMessage('??????????????????', opt);
        }
    },
});
