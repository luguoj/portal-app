Ext.define('PortalApp.view.portalConsole.dashboard.PartViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-dashboard-partviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const moduleStore = this.getStore('modules'),
                partStore = this.getStore('parts');
            moduleStore.load();
            partStore.load();
        }
    },
    hBtnRefresh: function () {
        this.loadData();
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
    onGrdBeforeEdit: function (editor, context) {
        return context.record.get('part') && (context.colIdx == 1 || context.colIdx == 2);
    },
    onGrdEdit: function (editor, context) {
        const me = this,
            record = context.record,
            newValues = {
                code: context.newValues.code,
                description: context.newValues.description
            };
        if (record.get('version') == undefined) {
            if (record.get('moduleId') != 'general') {
                newValues.moduleId = record.get('moduleId');
            }
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        } else {
            Object.assign(
                newValues,
                {
                    id: record.get('id'),
                    version: record.get('version')
                }
            );
            PortalApp.data.api.entity.EntityCRUDApi.patch({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                fields: ['code', 'description'],
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            record = btn.lookupViewModel().get('record');
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
            fields: ['enabled'],
            values: {
                id: record.get('id'),
                version: record.get('version'),
                enabled: !record.get('enabled')
            },
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.loadData();
            }
        })
    },
    hBtnAdd: function (grid, rowIndex) {
        const me = this,
            currentNode = grid.getStore().getAt(rowIndex),
            plgRowediting = grid.editingPlugin,
            now = (new Date()).getTime();
        const newNode = currentNode.appendChild(
            currentNode.createNode({
                id: 'new-' + now,
                moduleId: currentNode.get('id'),
                part: true,
                code: '',
                description: '',
                enabled: false,
                iconCls: 'x-fa fa-chart-pie',
                sort: '0',
                content: [],
                leaf: true
            })
        );
        currentNode.expand();
        newNode.set('code', 'new-' + now);
        newNode.set('description', '新部件-' + now);
        plgRowediting.startEdit(newNode, 1);
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            store = grid.getStore(),
            record = store.getAt(rowIndex);
        if (record.get('version') != null) {
            PSR.util.Message.confirm('删除:' + record.get('code'), function () {
                view.mask('处理中...');
                PortalApp.data.api.entity.EntityCRUDApi.delete({
                    application: 'portal',
                    domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                    ids: [record.get('id')],
                    success: function (data) {
                        store.remove([record]);
                        me.loadData();
                        PSR.util.Message.info('删除成功');
                    },
                    complete: function () {
                        view.unmask();
                    }
                });
            });
        } else {
            store.remove([record]);
        }
    },
    hBtnEdit: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex),
            editor = this.editor = Ext.create({
                xtype: 'portalconsole-dashboard-part-editorview',
                width: view.getWidth() * 0.75,
                height: view.getHeight() * 0.75,
                dashboardPart: record,
                listeners: {
                    save: function (values) {
                        const newValues = {
                            id: record.get('id'),
                            version: record.get('version'),
                            moduleId: values.moduleId,
                            config: JSON.stringify(JSON.parse(values.configValue))
                        }
                        PortalApp.data.api.entity.EntityCRUDApi.patch({
                            application: 'portal',
                            domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                            fields: ['config', 'moduleId'],
                            values: newValues,
                            success: function (data) {
                                PSR.util.Message.info('保存成功');
                                record.set('moduleId', data.moduleId);
                                record.set('config', data.config);
                                record.set('version', data.version);
                                editor.setDashboardPart(Ext.data.Model.loadData(data));
                            }
                        })
                    },
                    close: function () {
                        view.unmask();
                    }
                }
            });
        view.mask();
        view.fireEvent('popupview', editor);
    },
});
