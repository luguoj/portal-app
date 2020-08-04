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
        Ext.Ajax.request(opt);
    },
    hCallSuccess: function (response, opt) {
        try {
            var respObj = JSON.parse(response.responseText);
            if (respObj.success) {
                if (opt && opt.bizSuccess) {
                    opt.bizSuccess(respObj.result);
                }
            } else {
                PSR.Message.error(respObj.message);
                console.log(respObj.message);
                if (opt && opt.bizFailure) {
                    opt.bizFailure(respObj);
                }
            }
            if (opt.complete) {
                opt.complete(response, opt);
            }
        } catch (err) {
            PSR.Message.error(err);
            console.error(err);
            PSR.Ajax.hCallFailure(response, opt);
        }
    },
    hCallFailure: function (response, opt) {
        PSR.Message.error(response);
        console.log(response);
        if (opt.complete) {
            opt.complete(response, opt);
        }
    }
});
