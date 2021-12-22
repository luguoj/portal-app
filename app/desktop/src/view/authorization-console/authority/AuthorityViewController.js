Ext.define('PortalApp.view.authorizationConsole.AuthorityViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-authorityviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        const authorityStore = this.getStore('authorities');
        authorityStore.load();
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
                domainType: 'org.psr.platform.authorization.entity.AuthorityEntity',
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
                domainType: 'org.psr.platform.authorization.entity.AuthorityEntity',
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
            authorityStore = this.getStore('authorities'),
            plgRowediting = view.down('grid').findPlugin('rowediting'),
            newId = 'authority_' + (new Date()).getTime();
        authorityStore.loadData([{id: newId}], true);
        const record = authorityStore.findRecord('id', newId);
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
                PortalApp.data.api.authorization.AuthorityApi.delete({
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
    hBtnGroup: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'authorizationconsole-authority-groupview-' + record.get('id'),
            title: '授权分组:' + record.get('id'),
            iconCls: 'x-fa fa-users',
            viewConfig: {
                xtype: 'authorizationconsole-authority-groupview',
                user: record,
            },
        })
    },
    hBtnUser: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'authorizationconsole-authority-userview-' + record.get('id'),
            title: '授权用户:' + record.get('id'),
            iconCls: 'x-fa fa-user',
            viewConfig: {
                xtype: 'authorizationconsole-authority-userview',
                user: record,
            },
        })
    },
});