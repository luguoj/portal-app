Ext.define('PortalApp.view.portalConsole.dashboard.part.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-dashboard-part-editorviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (view.rendered) {
            const form = this.lookup('form'),
                dashboardPart = view.getDashboardPart(),
                configValue = dashboardPart.get('config'),
                moduleId = dashboardPart.get('moduleId');
            form.loadRecord(Ext.data.Model.loadData({
                moduleId: moduleId,
                configValue: configValue ? JSON.stringify(JSON.parse(configValue), null, 2) : ''
            }));
            this.hBtnCheck();
        }
    },
    onFrmDirtyChange: function (form, dirty) {
        this.getViewModel().set('dirty', dirty);
    },
    hBtnCheck: function () {
        const form = this.lookup('form'),
            values = form.getValues(),
            configValue = values.configValue,
            moduleId = values.moduleId,
            txtConfigValue = form.down('textarea');
        try {
            txtConfigValue.setValue(
                JSON.stringify(eval('(' + configValue + ')'), null, 2)
            );
            PSR.util.Message.info('校验成功');
            const pnPreview = this.lookup('pnPreview');
            pnPreview.removeAll();
            pnPreview.add({
                xtype: 'portalapp-modulecomponent',
                moduleId: moduleId,
                componentTpl: eval('(' + configValue + ')')
            })
            return true;
        } catch (e) {
            console.error(e);
            PSR.util.Message.info('校验失败');
            return false;
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnSave: function () {
        if (this.hBtnCheck()) {
            if (this.getViewModel().get('dirty')) {
                this.getView().fireEvent('save', this.lookup('form').getValues());
            }
        }
    }
});
