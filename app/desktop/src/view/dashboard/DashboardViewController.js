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
    },
    onBtnEditToggle: function (btn, pressed) {
        const boards = this.getView().query('dashboard-placeholderview');
        for (let i = 0; i < boards.length; i++) {
            const board = boards[i];
            board.setEditing(pressed);
        }
    },
    hBtnAdd: function () {
    },
    hBtnCancel: function () {
        this.getViewModel().set('editing', false);
    }
});
