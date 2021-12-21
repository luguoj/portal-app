Ext.define('PortalApp.view.portalConsole.GroupViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-groupviewcontroller',
    loadData: function () {
        const groupTreeStore = this.getStore('groupTree');
        groupTreeStore.removeAll();
        groupTreeStore.load();
    },
    onGrdBeforeEdit: function (editor, context) {
        return !!context.record.get('isRecord') && (context.colIdx == 1 || context.colIdx == 2);
    },
    hBtnEnable: function (btn) {
        const me = this,
            record = btn.lookupViewModel().get('record');
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'portal',
            domainType: 'org.psr.platform.portal.entity.GroupEntity',
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
                domainType: 'org.psr.platform.portal.entity.GroupEntity',
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
                domainType: 'org.psr.platform.portal.entity.GroupEntity',
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
                text: '新分组-' + now,
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
        plgRowediting.startEdit(newNode);
    },
    hBtnClone: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        PSR.util.Message.confirm('克隆:' + record.get('code'), function () {
            view.mask('处理中...');
            PortalApp.data.api.portal.GroupApi.clone({
                id: record.get('id'),
                success: function () {
                    me.loadData();
                    PSR.util.Message.info('克隆成功');
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
            PSR.util.Message.confirm('删除:' + record.get('code'), function () {
                view.mask('处理中...');
                PortalApp.data.api.portal.GroupApi.delete({
                    id: record.get('id'),
                    success: function () {
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
    hBtnNavigationItem: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'portalconsole-group-groupnavigationitemview-' + record.get('id'),
            title: '分组导航:' + record.get('code'),
            iconCls: 'x-fa fa-sitemap',
            viewConfig: {
                xtype: 'portalconsole-group-groupnavigationitemview',
                group: record,
            },
        })
    },
    hBtnModuleAction: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'portalconsole-group-groupmoduleactionview-' + record.get('id'),
            title: '分组操作:' + record.get('code'),
            iconCls: 'x-fa fa-bolt',
            viewConfig: {
                xtype: 'portalconsole-group-groupmoduleactionview',
                group: record,
            },
        })
    },
    hBtnUser: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'portalconsole-group-groupuserview-' + record.get('id'),
            title: '分组用户:' + record.get('code'),
            iconCls: 'x-fa fa-users',
            viewConfig: {
                xtype: 'portalconsole-group-groupuserview',
                group: record,
            },
        })
    },
});
