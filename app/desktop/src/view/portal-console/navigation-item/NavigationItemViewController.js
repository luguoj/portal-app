Ext.define('PortalApp.view.portalConsole.NavigationViewItemController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-navigationitemviewcontroller',
    onCombPortalChange: function (comb, newValue) {
        this.getViewModel().set('portalId', newValue);
        this.getView().down('treepanel').setDisabled(false);
        this.getStore('navigationItemTree').addFilter(
            {
                property: 'portalId',
                operator: '==',
                value: newValue
            }, true);
        this.loadData();
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    loadData: function () {
        this.getStore('navigationItemTree').load();
    },
    hBtnAddCatalog: function (grid, rowIndex) {
        const me = this,
            viewModel = this.getViewModel(),
            currentNode = grid.getStore().getAt(rowIndex),
            plgRowediting = grid.editingPlugin,
            now = (new Date()).getTime();
        const newNode = currentNode.appendChild(
            currentNode.createNode({
                id: 'new-' + now,
                portalId: viewModel.get('portalId'),
                parentId: currentNode.get('id'),
                isView: false,
                text: '',
                iconCls: '',
                sort: '0',
                content: [],
                expanded: true,
                leaf: false
            })
        );
        currentNode.expand();
        newNode.set('text', '新目录-' + now);
        newNode.set('iconCls', 'x-fa fa-cubes');
        plgRowediting.startEdit(newNode);
    },
    hBtnAddView: function (grid, rowIndex) {
        const me = this,
            viewModel = this.getViewModel(),
            currentNode = grid.getStore().getAt(rowIndex),
            plgRowediting = grid.editingPlugin,
            now = (new Date()).getTime();
        const newNode = currentNode.appendChild(
            currentNode.createNode({
                id: 'new-' + now,
                portalId: viewModel.get('portalId'),
                parentId: currentNode.get('id'),
                isView: true,
                text: '',
                iconCls: '',
                sort: '0',
                content: [],
                leaf: true
            })
        );
        currentNode.expand();
        newNode.set('text', '新视图-' + now);
        newNode.set('iconCls', 'x-fa fa-cube');
        plgRowediting.startEdit(newNode);
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        PSR.util.Message.confirm('删除:' + record.get('text'), function () {
            view.mask('处理中...');
            PortalApp.data.api.portal.NavigationItemApi.delete({
                id: record.get('id'),
                success: function () {
                    me.getStore('modules').reload();
                    PSR.util.Message.info('删除成功');
                },
                complete: function () {
                    view.unmask();
                }
            });
        });
    },
    hBtnEdit: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'portalconsole-navigationitem-editorview-' + record.get('id'),
            title: '视图:' + record.get('text'),
            iconCls: 'x-fa fa-edit',
            viewConfig: {
                xtype: 'portalconsole-navigationitem-editorview',
                navigationItem: record,
            },
        })
    },
    onGrdBeforeEdit: function (editor, context) {
        return context.record.get('id') != 'root';
    },
    onGrdEdit: function (editor, context) {
        const me = this,
            record = context.record,
            newValues = {
                text: context.newValues.text,
                iconCls: context.newValues.iconCls,
                sort: context.newValues.sort
            };
        if (record.get('version') == undefined) {
            newValues.isView = record.get('isView');
            newValues.portalId = record.get('portalId');
            if (record.get('parentId') != 'root') {
                newValues.parentId = record.get('parentId');
            }
            PortalApp.data.api.entity.EntityCRUDApi.create({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.NavigationItemEntity',
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
                domainType: 'org.psr.platform.portal.entity.NavigationItemEntity',
                fields: ['text', 'iconCls', 'parentId'],
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        }
    }
});
