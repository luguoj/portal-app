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
            txtConfigValue = form.down('textarea[name=configValue]'),
            txtTestingConfig = this.lookup('txtTestingConfig'),
            pnPreview = this.lookup('pnPreview');
        pnPreview.removeAll();
        let partConfig, testingConfig, finalConfig;
        try {
            partConfig = values.configValue ? eval('(' + values.configValue + ')') : null;

        } catch (e) {
            console.error(e);
            PSR.util.Message.info('部件配置语法错误');
            return false;
        }
        if (!partConfig) {
            PSR.util.Message.info('校验失败，缺少配置');
            return false;
        }
        txtConfigValue.setValue(
            JSON.stringify(partConfig, null, 2)
        );
        if (!partConfig.xtype) {
            PSR.util.Message.info('校验失败，缺少配置项xtype');
            return false;
        }
        try {
            testingConfig = txtTestingConfig.getValue() ? eval('(' + txtTestingConfig.getValue() + ')') : null;
        } catch (e) {
            console.error(e);
            PSR.util.Message.info('测试配置语法错误');
            return false;
        }
        if (testingConfig) {
            txtTestingConfig.setValue(
                JSON.stringify(testingConfig, null, 2)
            );
        }
        finalConfig = Object.assign(
            {},
            partConfig,
            testingConfig
        )
        pnPreview.add({
            xtype: 'portalapp-modulecomponent',
            moduleId: values.moduleId,
            componentTpl: finalConfig
        })
        PSR.util.Message.info('校验成功');
        return true;

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
