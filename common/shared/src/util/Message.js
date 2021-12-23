Ext.define('PSR.util.Message', {
    singleton: true,
    info: function (message, title, callback) {
        if (title) {
            Ext.Msg.show({
                iconCls: Ext.Msg.INFO,
                title: title,
                message: message,
                buttons: Ext.Msg.OK,
                fn: callback
            });
        } else {
            Ext.toast(message);
        }
    },
    error: function (message, callback) {
        console.error(new Error(message));
        Ext.Msg.alert('错误', message, callback);
    },
    warn: function (message) {
        console.warn(message);
        Ext.Msg.show({
            iconCls: Ext.Msg.WARNING,
            title: '警告',
            message: message,
            buttons: Ext.Msg.OK,
            fn: callback
        });
    },
    confirm: function (message, callback) {
        Ext.Msg.confirm('确认', message, function (buttonId) {
            if (buttonId == 'yes') {
                callback();
            }
        });
    }
});
