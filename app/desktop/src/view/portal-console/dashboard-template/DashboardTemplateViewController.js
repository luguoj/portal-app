Ext.define('PortalApp.view.portalConsole.DashboardTemplateViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-dashboardtemplateviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            const dashboardTemplateTreeStore = this.getStore('dashboardTemplateTree');
            dashboardTemplateTreeStore.removeAll();
            dashboardTemplateTreeStore.load();
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onGrdBeforeEdit: function (editor, context) {
        return !!context.record.get('isRecord') && (context.colIdx == 1 || context.colIdx == 2);
    },
    hBtnEnable: function (btn) {
        const me = this,
            record = btn.lookupViewModel().get('record');
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
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
    onGrdEdit: function (editor, context) {
        const me = this,
            record = context.record,
            newValues = {
                code: context.newValues.code,
                description: context.newValues.description
            };
        if (record.get('version') == undefined) {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
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
                domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
                fields: ['code', 'description'],
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        }
    },
    hBtnAdd: function (grid, rowIndex) {
        const me = this,
            viewModel = this.getViewModel(),
            currentNode = grid.getStore().getAt(rowIndex),
            plgRowediting = grid.editingPlugin,
            now = (new Date()).getTime();
        const newNode = currentNode.appendChild(
            currentNode.createNode({
                id: 'new-' + now,
                isRecord: true,
                code: '',
                description: '',
                enabled: null,
                text: '新模板-' + now,
                content: [],
                leaf: true
            })
        );
        currentNode.expand();
        if (currentNode.get('id') == 'root') {
            newNode.set('code', '新分组-' + now);
        } else {
            newNode.set('code', currentNode.get('code') + '/新分组-' + now);
        }
        newNode.set('description', '新分组-' + now);
        newNode.set('enabled', false);
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
                PortalApp.data.api.portal.DashboardTemplateApi.delete({
                    id: record.get('id'),
                    success: function () {
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
});
