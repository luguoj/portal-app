Ext.define('PortalApp.view.portalConsole.dashboard.part.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-dashboard-part-editorviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const me = this,
                form = this.lookup('form'),
                configValue = this.getView().getPartConfigValue();
            form.loadRecord(Ext.data.Model.loadData({
                configValue: configValue ? JSON.stringify(JSON.parse(configValue), null, 2) : ''
            }));
        }
    },
    onFrmDirtyChange: function (form, dirty) {
        this.getViewModel().set('dirty', dirty);
    },
    hBtnCheck: function () {
        const txtConfigValue = this.lookup('form').down('field[name=configValue]');
        try {
            txtConfigValue.setValue(
                JSON.stringify(eval('(' + txtConfigValue.getValue() + ')'), null, 2)
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
            const txtConfigValue = this.lookup('form').down('field[name=configValue]');
            this.getView().fireEvent('save', txtConfigValue.getValue());
        }
    }
});
