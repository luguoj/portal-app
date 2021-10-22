Ext.define('PortalApp.view.profile.ProfileView',{
	extend: 'Ext.panel.Panel',
	xtype: 'profileview',
	controller: 'profileviewcontroller',
	viewModel: {type: 'profileviewmodel'},	
	requires: [
		'Ext.dataview.listswiper.ListSwiper',
		'Ext.dataview.plugin.ListPaging'
	],
	bodyPadding: '10 10 10 10',
	scrollable: 'y',
	defaults: {
		labelWidth: 120
	},
	items: [
		{ xtype: 'textfield', label: 'English Name', name: 'english', value: 'Norma Flores' },
		{ xtype: 'textfield', label: 'ID No.', name: 'id', value: '15467' },
		{
			xtype: 'container',
			layout:  'hbox',
			items: [
				{
					xtype: 'button',
					text : 'Take Picture',
					ui: 'action',
					width: 150,
					height: 50,
					handler: function() {
						navigator.camera.getPicture(
							function(imageFile) {
								var image = document.getElementById('myProof');
								image.src = imageFile;
							}, 
							function(message) {
								alert(message)
							}
						)
					}
				},
				{ xtype: 'component', flex: 1 },
				{ xtype: 'component', margin: '0 0 0 0', html: '<img id="myProof" border="5" alt="" src="" height="130" width="130">' },
			]
		},
		{ xtype: 'textfield', label: 'Sex', name: 'sex', value: 'femaie' },
		{
			xtype: 'textfield',
			autoComplete: true,
			autoCorrect: true,
			allowBlank: false,
			required: true,
			label: 'User ID',
			name: 'user',
			placeholder: 'user id',
			value: 'norma.flores'
		},
		{
			xtype: 'datepickerfield',
			label: 'Date of Birth',
			name: 'dob',
			value: '12/14/1987',
			maxValue: new Date()
		},
		{ xtype: 'textfield', label: 'Phone Number', name: 'phone', value: '888-1234' },
		{ xtype: 'textfield', label: 'Nationality', name: 'nationality', value: 'Spanish' }
	]
});

//		{ xtype: 'textfield', label: 'Chinese Name', name: 'chinese', value: '诺玛·弗洛雷斯' },
