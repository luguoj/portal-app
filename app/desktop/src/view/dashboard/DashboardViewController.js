Ext.define('PortalApp.view.dashboard.DashboardViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-dashboardviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {

        }
    },
    hBtnRefresh: function () {
        this.loadData();
    }
});
