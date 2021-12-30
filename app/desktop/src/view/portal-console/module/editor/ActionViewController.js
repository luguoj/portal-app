Ext.define('PortalApp.view.portalConsole.module.ActionViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-module-editor-actionviewcontroller',
    loadData: function () {
        const viewModel = this.getViewModel(),
            module = viewModel.get('module'),
            actionStore = this.getStore('actions');
        if (module) {
            actionStore.addFilter(
                {
                    property: 'moduleId',
                    operator: '==',
                    value: module.get('id')
                }, true);
            actionStore.load();
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    hBtnAdd: function () {
        const view = this.getView(),
            actionStore = this.getStore('actions'),
            plgRowediting = view.down('grid').findPlugin('rowediting'),
            newId = (new Date()).getTime();
        actionStore.loadData([{id: newId, code: '', description: ''}], true);
        const record = actionStore.findRecord('id', newId);
        record.set('code', 'action-' + newId);
        record.set('description', '操作-' + newId);
        plgRowediting.startEdit(record);
    },
    onGrdEdit: function (editor, context) {
        const me = this,
            viewModel = this.getViewModel(),
            module = viewModel.get('module'),
            record = context.record,
            newValues = {
                enabled: context.newValues.enabled,
                code: context.newValues.code,
                description: context.newValues.description
            };
        if (record.get('version') == undefined) {
            Object.assign(
                newValues,
                {
                    moduleId: module.get('id')
                }
            );
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
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
                domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                fields: ['enabled', 'code', 'description'],
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        }
    },
    hBtnEnable: function (btn, e) {
        const me = this,
            record = btn.lookupViewModel().get('record'),
            fields = ['enabled'],
            values = {
                id: record.get('id'),
                version: record.get('version'),
                enabled: !record.get('enabled')
            };
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
            fields: fields,
            values: values,
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.loadData();
            }
        });
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            actionStore = this.getStore('actions'),
            record = grid.getStore().getAt(rowIndex);
        if (record.get('version') == undefined) {
            actionStore.remove(record);
        } else {
            PSR.util.Message.confirm('删除模块操作:' + record.get('code'), function () {
                view.mask('处理中...');
                PortalApp.data.api.portal.ModuleApi.deleteAction({
                    id: record.get('id'),
                    success: function () {
                        actionStore.remove([record]);
                        me.loadData();
                        PSR.util.Message.info('删除成功');
                    },
                    complete:function (){
                        view.unmask();
                    }
                });
            });
        }
    }
});