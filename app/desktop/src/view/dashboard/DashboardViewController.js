Ext.define('PortalApp.view.dashboard.DashboardViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-dashboardviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (this.getView().rendered) {
            const dashboardTemplateTreeStore = this.getStore('dashboardTemplateTree');
            dashboardTemplateTreeStore.removeAll();
            dashboardTemplateTreeStore.load();
            view.remove(view.down('dashboard-subboardview'));
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onTreePickSelect: function (picker, record) {
        this.getViewModel().set('dashboardTemplateId', record.get('id'));
        this.loadData();
    },
    onDataLoad: function () {
        const view = this.getView(),
            dashboardTemplateId = this.getViewModel().get('dashboardTemplateId'),
            dashboardTemplate = this.getStore('dashboardTemplateTree').byIdMap[dashboardTemplateId];
        if (dashboardTemplate) {
            const dashboardConfigValue = dashboardTemplate.get('config');
            this.initDashboard(dashboardConfigValue ? JSON.parse(dashboardConfigValue) : null);
        }
    },
    initDashboard: function (config) {
        const view = this.getView();
        view.remove(view.down('dashboard-subboardview'));
        if (config) {
            const dashboardConfig = {
                xtype: 'dashboard-subboardview',
                height: '100%'
            };
            if (config.height) {
                dashboardConfig.height = config.height;
            }
            dashboardConfig.boardConfig = config.boardConfig;
            dashboardConfig.subBoardConfigs = config.subBoardConfigs;
            view.add(dashboardConfig);
        }
    }
});
