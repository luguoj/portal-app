Ext.define('PSR.Message', {
    singleton: true,
    info: function (message) {
        Ext.toast(message);
    },
    error: function (message, callback) {
        Ext.Msg.alert('错误', message, function () {
            if (callback) {
                callback();
            }
        });
    }
});
