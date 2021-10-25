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
		const me = this;
		PSR.clientSite.ClientSite.loginSuccess = function () {
			const elem = document.getElementById("splash")
			elem.parentNode.removeChild(elem)
			Ext.getBody().removeCls('launching')
			if (!me.desktopView) {
				me.desktopView = Ext.Viewport.add({xtype: 'mainview'});
			}
		};
		if(window.login){
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
