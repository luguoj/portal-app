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
                opt.bizSuccess(respObj);
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
        console.log(response);
        PSR.Message.error(response.statusText);
        try {
            const respObj = response.responseJson ? response.responseJson
                : JSON.parse(response.responseText);
            if (opt.onErrorMessage) {
                opt.onErrorMessage(respObj.message);
            } else {
                PSR.Message.error(respObj.message);
            }
            if (opt && opt.bizFailure) {
                opt.bizFailure(respObj);
            }
            if (opt.complete) {
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
    }
});
