Ext.define('PortalApp.Application', {
    extend: 'Ext.app.Application',
    name: 'PortalApp',
    requires: [
        'PortalApp.*',
        'PSR.*',
        'Ext.*',
        'PortalModule.*'
    ],
    defaultToken: 'homeview',

    launch: function () {
        const me = this;
        Ext.ariaWarn = Ext.emptyFn
        PSR.util.Auth.loginSuccess = function () {
            const elem = document.getElementById("splash")
            elem.parentNode.removeChild(elem)
            Ext.getBody().removeCls('launching')
            if (!me.desktopView) {
                if (Ext.isClassic == true) {
                    me.desktopView = Ext.create({xtype: 'mainview', appTitle: document.title, plugins: 'viewport'})
                } else {
                    me.desktopView = Ext.Viewport.add([{xtype: 'mainview', appTitle: document.title}])
                }
            }
        };
        if (window.login) {
            PSR.util.Auth.loginSuccess();
            delete PSR.util.Auth.loginSuccess;
        }
    },

    onAppUpdate: function () {
        Ext.Msg.confirm('Application Update', 'This application has an update, reload?',
            function (choice) {
                if (choice === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
