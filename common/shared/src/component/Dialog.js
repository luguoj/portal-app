Ext.define('PSR.Dialog', {
    singleton: true,
    upload: function (config) {
        if (window.portalEnv.profile == 'phone') {
            // return Ext.create('PSR.dialog.Upload', config).show(); TODO
        } else {
            return Ext.create('PSR.window.Upload', config).show();
        }
    }
});