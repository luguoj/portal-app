Ext.define('PortalApp.view.authorizationConsole.UserViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authorizationconsole-userviewcontroller',
    loadData: function () {
        const userStore = this.getStore('users');
        userStore.load();
    },
    onGrdBeforeEdit: function (editor, context) {
        const idEditor = context.grid.getColumnManager().getHeaderByDataIndex('id').getEditor(),
            record = context.record;
        if (record.get('version') == null) {
            idEditor.setDisabled(false);
        } else {
            idEditor.setDisabled(true);
        }
        return context.colIdx > 0 && context.colIdx < 5;
    },
    onGrdEdit: function (editor, context) {
        const me = this,
            record = context.record,
            newValues = {
                id: context.newValues.id,
                accountExpiryTime: context.newValues.accountExpiryTime,
                accountLockExpiryTime: context.newValues.accountLockExpiryTime,
                passwordExpiryTime: context.newValues.passwordExpiryTime
            };
        if (record.get('version') == undefined) {
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserEntity',
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
                domainType: 'org.psr.platform.authorization.entity.UserEntity',
                fields: ['accountExpiryTime', 'accountLockExpiryTime', 'passwordExpiryTime'],
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
            userStore = this.getStore('users'),
            plgRowediting = view.down('grid').findPlugin('rowediting'),
            newId = 'user-' + (new Date()).getTime();
        userStore.loadData([{id: newId}], true);
        const record = userStore.findRecord('id', newId);
        plgRowediting.startEdit(record, 1);
    },
    hBtnEnable: function (btn) {
        const me = this,
            record = btn.lookupViewModel().get('record');
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'authorization',
            domainType: 'org.psr.platform.authorization.entity.UserEntity',
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
    hBtnResetPassword: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        PSR.util.Message.confirm('重置密码:' + record.get('id'), function () {
            view.mask('处理中...');
            PortalApp.data.api.authorization.UserApi.resetPassword({
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
    hBtnAuthority: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'authorizationconsole-user-authorityview-' + record.get('id'),
            title: '用户授权:' + record.get('id'),
            iconCls: 'x-fa fa-shield-alt',
            viewConfig: {
                xtype: 'authorizationconsole-user-authorityview',
                user: record,
            },
        })
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            store = grid.getStore(),
            record = store.getAt(rowIndex);
        if (record.get('version') != null) {
            PSR.util.Message.confirm('删除用户:' + record.get('id'), function () {
                view.mask('处理中...');
                PortalApp.data.api.authorization.UserApi.delete({
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
