Ext.define('PortalApp.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mainviewmodel',
    data: {
        appTitle: '',
        personnel_description: '123'
    },
    formulas: {},
    stores: {
        navNodes: {
            type: 'portalapp-navigationitemtree',
            autoLoad: true
        }
    }
});
