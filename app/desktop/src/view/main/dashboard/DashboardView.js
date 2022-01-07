Ext.define('PortalApp.view.main.DashboardView', {
    extend: 'Ext.panel.Panel',
    xtype: 'main-dashboardview',
    config: {
        dashboardConfig: null
    },
    layout: 'fit',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }],
        bind: {
            hidden: '{fullscreen}'
        }
    },
    items: [],
    updateDashboardConfig: function (value) {
        this.getController().loadData();
    },
    controller: 'main-dashboardviewcontroller',
    viewModel: {
        data: {},
        stores: {}
    }
});