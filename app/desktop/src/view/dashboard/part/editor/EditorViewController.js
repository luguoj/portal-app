Ext.define('PortalApp.view.dashboard.part.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.dashboard-part-editorviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const view = this.getView();
        if (view.rendered) {
            const moduleStore = this.getStore('modules'),
                partStore = this.getStore('parts');
            moduleStore.load();
            partStore.load();
            const form = this.lookup('form'),
                content = view.getContent(),
                dashboardPartId = content ? content.dashboardPartId : null,
                extraConfig = Object.assign({}, content);
            delete extraConfig.dashboardPartId;
            form.loadRecord(Ext.data.Model.loadData({
                dashboardPartId: dashboardPartId ? dashboardPartId : null,
                extraConfigValue: extraConfig ? JSON.stringify(extraConfig, null, 2) : ''
            }));
        }
    },
    onDataLoad: function () {
        const moduleStore = this.getStore('modules'),
            partStore = this.getStore('parts'),
            modulePartTreeStore = this.getStore('modulePartTree');
        if (moduleStore.isLoaded() && partStore.isLoaded()) {
            const modules = moduleStore.getData().items,
                parts = partStore.getData().items,
                partMap = {general: []},
                modulePartTreeData = [];
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (!part.get('moduleId')) {
                    partMap.general.push(part);
                } else {
                    if (!partMap[part.get('moduleId')]) {
                        partMap[part.get('moduleId')] = [];
                    }
                    partMap[part.get('moduleId')].push(part);
                }
            }
            modules.push(Ext.data.Model.loadData({
                id: 'general',
                code: ' general',
                description: ' 通用部件'
            }));
            for (let i = 0; i < modules.length; i++) {
                const module = modules[i];
                const moduleNode = Object.assign({
                    module: true,
                    children: [],
                    iconCls: 'x-fa fa-list-alt',
                    leaf: false,
                    expanded: true
                }, module.data);
                modulePartTreeData.push(moduleNode);
                if (partMap[module.get('id')]) {
                    for (let j = 0; j < partMap[module.get('id')].length; j++) {
                        const part = partMap[module.get('id')][j];
                        moduleNode.children.push(Object.assign({
                            part: true,
                            isRecord: true,
                            iconCls: 'x-fa fa-chart-pie',
                            leaf: true
                        }, part.data));
                    }
                }
            }
            modulePartTreeStore.getProxy().setData({children: modulePartTreeData});
            modulePartTreeStore.load();
        }
        this.loadPart();
        this.hBtnCheck();
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onFrmDirtyChange: function (form, dirty) {
        this.getViewModel().set('dirty', dirty);
    },
    hBtnCheck: function () {
        const form = this.lookup('form'),
            values = form.getValues(),
            moduleId = this.lookup('txtPartModuleId').getValue(),
            partConfigValue = this.lookup('txtPartConfigValue').getValue(),
            txtExtraConfigValue = form.down('textarea[name=extraConfigValue]'),
            pnPreview = this.lookup('pnPreview');
        let partConfig, extraConfig, finalConfig;
        try {
            partConfig = partConfigValue ? eval('(' + partConfigValue + ')') : null;
        } catch (e) {
            console.error(e);
            PSR.util.Message.info('部件配置语法错误');
            return false;
        }
        try {
            extraConfig = values.extraConfigValue ? eval('(' + values.extraConfigValue + ')') : null;
        } catch (e) {
            console.error(e);
            PSR.util.Message.info('额外配置语法错误');
            return false;
        }
        txtExtraConfigValue.setValue(JSON.stringify(extraConfig, null, 2));
        pnPreview.removeAll();
        finalConfig = Object.assign(
            {},
            partConfig,
            extraConfig
        );
        pnPreview.add({
            xtype: 'portalapp-modulecomponent',
            moduleId: moduleId,
            componentTpl: finalConfig
        });
        PSR.util.Message.info('校验成功');
        return true
    },
    hBtnSave: function () {
        const view = this.getView(),
            form = this.lookup('form');
        if (this.hBtnCheck()) {
            const values = form.getValues(),
                extraConfigValue = values.extraConfigValue,
                dashboardPartId = values.dashboardPartId,
                content = Object.assign(
                    {},
                    JSON.parse(extraConfigValue),
                    {
                        dashboardPartId: dashboardPartId
                    }
                );
            view.fireEvent('save', content);
        }
    },
    loadPart: function () {
        const partStore = this.getStore('parts'),
            form = this.lookup('form'),
            values = form.getValues(),
            dashboardPartId = values.dashboardPartId,
            txtModuleId = this.lookup('txtPartModuleId'),
            txtPartConfigValue = this.lookup('txtPartConfigValue'),
            record = (dashboardPartId && partStore.isLoaded()) ? partStore.findRecord('id', dashboardPartId) : null;
        txtModuleId.setValue(record ? record.get('moduleId') : '');
        txtPartConfigValue.setValue(record ? record.get('config') : '');
    }
});
