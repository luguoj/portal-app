Ext.define('PortalApp.view.main.MenuViewController', {
	extend: 'Ext.app.ViewController',
	alias: 'controller.menuviewcontroller',

	onMenuClick: function(button) {
		Ext.Viewport.toggleMenu('left');
		Ext.getCmp('theToolbar').setTitle(button.getText()) 
		this.redirectTo( button.tag );
	}

});
