Ext.define('PortalApp.view.authorizationConsole.ResourceViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-resourceviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const resourceStore = this.getStore('resources');
        resourceStore.load();
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onGrdBeforeEdit: function (editor, context) {
        const idEditor = context.grid.getColumnManager().getHeaderByDataIndex('id').getEditor(),
            record = context.record;
        if (record.get('version') == null) {
            idEditor.setDisabled(false);
        } else {
            idEditor.setDisabled(true);
        }
        return context.colIdx >= 0 && context.colIdx < 3;
    },
    onGrdEdit: function (editor, context) {
        const me = this,
            record = context.record,
            newValues = {
                id: context.newValues.id,
                description: context.newValues.description,
                catalog: context.newValues.catalog
            };
        if (record.get('version') == null) {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ResourceEntity',
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
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ResourceEntity',
                fields: ['description', 'catalog'],
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        }
    },
    hBtnAdd: function () {
        const view = this.getView(),
            resourceStore = this.getStore('resources'),
            plgRowediting = view.down('grid').findPlugin('rowediting'),
            newId = 'resource-' + (new Date()).getTime();
        resourceStore.loadData([{id: newId}], true);
        const record = resourceStore.findRecord('id', newId);
        plgRowediting.startEdit(record, 1);
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            store = grid.getStore(),
            record = store.getAt(rowIndex);
        if (record.get('version') != null) {
            PSR.util.Message.confirm('删除权限:' + record.get('id'), function () {
                view.mask('处理中...');
                PortalApp.data.api.authorization.ResourceApi.delete({
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
    }
});