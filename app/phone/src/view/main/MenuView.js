Ext.define('PortalApp.view.main.MenuView', {
	extend: 'Ext.Sheet',
	xtype: 'menuview',
	controller: 'menuviewcontroller',
	layout: 'vbox',
	width:180,
	cls: 'menuview',
	items: [
		{ xtype: 'image', src: 'resources/shared/images/SenchaLeaf.jpeg', height: 180 },
		{
			xtype: 'container',
			cls: 'menubuttons',
			layout: 'vbox',
			flex: 1,
			defaults: {
				xtype: 'button',
				ui: 'menubutton',
				handler: 'onMenuClick'
			},
			items: [
				{ xtype: 'container', html: '&nbsp;', height: 20,},
				{ text: 'Personnel', tag: 'personnelview'},
//add new items on the next line (from sencha. generate viewpackage)

				{ text: 'Profile', tag: 'profileview'}
			]
		}
	]
});
