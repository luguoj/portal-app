Ext.define('PortalApp.view.dashboard.DashboardView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboardview',
    layout: {type: 'vbox', align: 'stretch'},
    scrollable: 'y',
    tbar: {
        items: ['模板:', {
            xtype: 'combobox'
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }],
        bind: {
            hidden: '{fullscreen}'
        }
    },
    items: [{
        xtype: 'dashboard-subboardview',
        height: '100%',
        resizable: {handles: 's'}
    }],
    controller: 'dashboard-dashboardviewcontroller',
    viewModel: {
        data: {
        }
    }
});
