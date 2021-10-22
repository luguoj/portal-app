Ext.define('PortalApp.Application', {
	extend: 'Ext.app.Application',
	name: 'PortalApp',
	requires: [
		'PortalApp.*',
		'Ext.*'
	],
	defaultToken: 'homeview',

	launch: function () {
		Ext.getBody().removeCls('launching');
		var elem = document.getElementById("splash");
		// elem.parentNode.removeChild(elem);

		// Ext.Viewport.add([{ xtype: 'mainview'}]);
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
