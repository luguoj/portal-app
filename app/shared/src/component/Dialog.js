Ext.define('PSR.Dialog', {
    singleton: true,
    upload: function (config) {
        if (window.portalEnv.profile == 'phone') {
            // return Ext.create('PSR.dialog.Upload', config).show();
        } else {
            return Ext.create('PSR.window.Upload', config).show();
        }
    }
});