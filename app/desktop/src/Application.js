Ext.define('PortalApp.Application', {
    extend: 'Ext.app.Application',
    name: 'PortalApp',
    requires: [
        'PortalApp.*',
        'PSR.*',
        'Ext.*'
    ],
    defaultToken: 'homeview',

    launch: function () {
        Ext.ariaWarn = Ext.emptyFn
        PSR.clientSite.ClientSite.loginSuccess = function () {
            var elem = document.getElementById("splash")
            elem.parentNode.removeChild(elem)
            Ext.getBody().removeCls('launching')
            if (!me.desktopView) {
                if (Ext.isClassic == true) {
                    me.desktopView = Ext.create({xtype: whichView, plugins: 'viewport'})
                } else {
                    me.desktopView = Ext.Viewport.add([{xtype: whichView}])
                }
            }
        };
        if (window.login) {
            PSR.clientSite.ClientSite.loginSuccess();
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
