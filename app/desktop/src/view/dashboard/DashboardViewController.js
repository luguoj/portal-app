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
        const board = this.getView().down('dashboard-subboardview');
        board.setEditing(pressed);
    },
    hBtnAdd: function () {
        const view = this.getView();
        view.remove(view.down('dashboard-subboardview'));
        view.add({
            xtype: 'dashboard-subboardview',
            height: '100%',
            resizable: {handles: 's'},
            editing: this.getViewModel().get('editing')
        });
        this.getViewModel().set('editing', true);
    },
    hBtnSave: function () {
        const board = this.getView().down('dashboard-subboardview');
        console.info(JSON.stringify(board.readBoardConfigTree()));
    },
    hBtnCancel: function () {
        this.getViewModel().set('editing', false);
    }
});
