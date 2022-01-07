Ext.define('PortalApp.view.main.DashboardViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-dashboardviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const view = this.getView(),
                dashboardConfigValue = view.getDashboardConfig() ? JSON.parse(view.getDashboardConfig()) : null;
            view.remove(view.down('dashboard-subboardview'));
            if (dashboardConfigValue) {
                const dashboardConfig = {
                    xtype: 'dashboard-subboardview',
                    height: '100%'
                };
                if (dashboardConfigValue.height) {
                    dashboardConfig.height = dashboardConfigValue.height;
                }
                dashboardConfig.boardConfig = dashboardConfigValue.boardConfig;
                dashboardConfig.subBoardConfigs = dashboardConfigValue.subBoardConfigs;
                view.add(dashboardConfig);
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    }
});
