Ext.define('PSR.util.Message', {
    singleton: true,
    info: function (message) {
        Ext.toast(message);
    },
    error: function (message, callback) {
        console.error(new Error(message));
        Ext.Msg.alert('错误', message, callback);
    },
    confirm: function (message, callback) {
        Ext.Msg.confirm('确认', message, function (buttonId) {
            if (buttonId == 'yes') {
                callback();
            }
        });
    }
});
