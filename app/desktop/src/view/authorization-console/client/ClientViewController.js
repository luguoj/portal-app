Ext.define('PortalApp.view.authorizationConsole.ClientViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-clientviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const clientStore = this.getStore('clients');
        clientStore.load();
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
                domainType: 'org.psr.platform.authorization.entity.ClientEntity',
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
                domainType: 'org.psr.platform.authorization.entity.ClientEntity',
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
            clientStore = this.getStore('clients'),
            plgRowediting = view.down('grid').findPlugin('rowediting'),
            newId = 'client-' + (new Date()).getTime();
        clientStore.loadData([{id: newId}], true);
        const record = clientStore.findRecord('id', newId);
        plgRowediting.startEdit(record, 1);
    },
    hBtnResetPassword: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        PSR.util.Message.confirm('重置密码:' + record.get('id'), function () {
            view.mask('处理中...');
            PortalApp.data.api.authorization.ClientApi.resetPassword({
                id: record.get('id'),
                success: function (data) {
                    me.loadData();
                    PSR.util.Message.info(
                        '新密码:<b>' + data + '</b>',
                        '重置成功'
                    );
                },
                complete: function () {
                    view.unmask();
                }
            });
        });
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            store = grid.getStore(),
            record = store.getAt(rowIndex);
        if (record.get('version') != null) {
            PSR.util.Message.confirm('删除权限:' + record.get('id'), function () {
                view.mask('处理中...');
                PortalApp.data.api.authorization.ClientApi.delete({
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
    hBtnResource: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'authorizationconsole-client-resourceview-' + record.get('id'),
            title: '客户端资源:' + record.get('id'),
            iconCls: 'x-fa fa-server',
            viewConfig: {
                xtype: 'authorizationconsole-client-resourceview',
                client: record,
            },
        })
    },
    hBtnAuthority: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'authorizationconsole-client-authorityview-' + record.get('id'),
            title: '客户端权限:' + record.get('id'),
            iconCls: 'x-fa fa-shield-alt',
            viewConfig: {
                xtype: 'authorizationconsole-client-authorityview',
                client: record,
            },
        })
    },
});