Ext.define('PSR.Message', {
    singleton: true,
    info: function (message) {
        Ext.toast(message);
    },
    error: function (message) {
        Ext.MessageBox.alert('错误', message);
    }
});
