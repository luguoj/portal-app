Ext.define('PortalApp.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mainviewmodel',
    data: {
        personnel_description: '123'
    },
    formulas: {},
    stores: {
        modules: {
            type: 'portalapp-navigationitemtree',
            autoLoad: true
        }
    }
});
