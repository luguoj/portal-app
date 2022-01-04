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
            resizable: {handles: 's'}
        });
        this.getViewModel().set('editing', true);
    },
    hBtnSave: function () {
        const board = this.getView().down('dashboard-subboardview');
        console.info(JSON.stringify(board.readBoardConfigTree()));
    },
    hBtnCancel: function () {
        this.getViewModel().set('editing', false);
    },
    hBtnImport: function () {
        const view = this.getView(),
            viewModel = this.getViewModel(),
            dialog = PSR.Dialog.upload({
                accept: '.dashboardconfig',
                uploadHandler: function (file) {
                    PSR.util.LocalFile.read(
                        file,
                        function (data) {
                            const boardConfigs = JSON.parse(PSR.util.Base64.decode(data));
                            view.remove(view.down('dashboard-subboardview'));
                            view.add({
                                xtype: 'dashboard-subboardview',
                                height: '100%',
                                resizable: {handles: 's'},
                                boardConfig: boardConfigs.boardConfig,
                                subBoardConfigs: boardConfigs.subBoardConfigs,
                            });
                            dialog.close();
                            viewModel.set('editing', true);
                        },
                        true
                    );
                }
            });
    },
    hBtnExport: function () {
        const board = this.getView().down('dashboard-subboardview');
        PSR.util.LocalFile.write(
            "export.dashboardconfig",
            PSR.util.Base64.encode(
                JSON.stringify(board.readBoardConfigTree())
            )
        );
    }
});
