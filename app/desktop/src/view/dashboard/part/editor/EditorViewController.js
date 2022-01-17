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
                extraConfig: extraConfig ? JSON.stringify(extraConfig, null, 2) : ''
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
            extraConfig = values.extraConfig,
            moduleId = this.lookup('txtPartModuleId').getValue(),
            partConfig = this.lookup('txtPartConfig').getValue(),
            txtExtraConfig = form.down('textarea[name=extraConfig]');
        try {
            txtExtraConfig.setValue(
                JSON.stringify(eval('(' + extraConfig + ')'), null, 2)
            );
            PSR.util.Message.info('校验成功');
            const pnPreview = this.lookup('pnPreview');
            pnPreview.removeAll();
            this.getView().fireEvent('loadmodule', {
                moduleId: moduleId,
                success: function () {
                    const finalConfig = Object.assign(
                        {},
                        eval('(' + partConfig + ')'),
                        eval('(' + extraConfig + ')')
                    );
                    pnPreview.add(Ext.create(finalConfig));
                },
                failure: function () {
                    pnPreview.add({
                        layout: 'center',
                        items: [{html: '模块加载失败'}]
                    });
                }
            });
            return true
        } catch (e) {
            console.error(e);
            PSR.util.Message.info('校验失败');
            return false;
        }
    },
    hBtnSave: function () {
        const view = this.getView(),
            form = this.lookup('form');
        if (this.hBtnCheck()) {
            const values = form.getValues(),
                extraConfig = values.extraConfig,
                dashboardPartId = values.dashboardPartId,
                content = Object.assign(
                    {},
                    JSON.parse(extraConfig),
                    {
                        dashboardPartId: dashboardPartId
                    }
                );
            view.fireEvent('save', content);
        }
    },
    onTreePickSelect: function (picker, record) {
        const view = this.getView(),
            txtModuleId = this.lookup('txtPartModuleId'),
            txtPartConfig = this.lookup('txtPartConfig');
        txtModuleId.setValue(record.get('moduleId'));
        txtPartConfig.setValue(record.get('config'));
    },
});
