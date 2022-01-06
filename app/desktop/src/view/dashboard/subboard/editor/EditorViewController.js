Ext.define('PortalApp.view.dashboard.subBoard.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-subboard-editorviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const me = this,
                form = this.lookup('form'),
                viewModel = this.getViewModel(),
                boardConfig = this.getView().getBoardConfig();
            form.loadRecord(Ext.data.Model.loadData({
                boardConfig: boardConfig ? JSON.stringify(JSON.parse(boardConfig), null, 2) : ''
            }));
        }
    },
    onFrmDirtyChange: function (form, dirty) {
        this.getViewModel().set('dirty', dirty);
    },
    hBtnCheck: function () {
        const txtViewConfig = this.lookup('form').down('field[name=boardConfig]');
        try {
            txtViewConfig.setValue(
                JSON.stringify(eval('(' + txtViewConfig.getValue() + ')'), null, 2)
            );
            PSR.util.Message.info('校验成功');
            return true;
        } catch (e) {
            PSR.util.Message.info('校验失败');
            return false;
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnSave: function () {
        if (this.hBtnCheck()) {
            const txtViewConfig = this.lookup('form').down('field[name=boardConfig]');
            this.getView().fireEvent('save', txtViewConfig.getValue());
        }
    }
});
