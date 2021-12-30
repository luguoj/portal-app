Ext.define('PortalApp.view.organizationconsole.OrganizationViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.organizationconsole-organizationviewcontroller',
    afterRender: function (view) {
        this.loadData();
    },
    loadData: function () {
        if (this.getView().rendered) {
            if (this.getViewModel().get('organizationUseId')) {
                this.getStore('organizationTree').load();
            }
        }
    },
    hBtnRefresh: function () {
        this.loadData();
    },
    onCombOrganizationUseChange: function (comb, newValue) {
        this.getViewModel().set('organizationUseId', newValue);
        this.getView().down('treepanel').setDisabled(false);
        this.getStore('organizationTree').addFilter(
            {
                property: 'useId',
                operator: '==',
                value: newValue
            }, true);
        this.loadData();
    },
    onOrganizationTreeLoad: function (store, record) {
        if (!record || record.length == 0) {
            const root = store.getRoot();
            root.appendChild(
                root.createNode({
                    id: 'root-org',
                    code: this.getViewModel().get('organizationUseId'),
                    left: 0,
                    content: [],
                    expanded: true,
                    leaf: false
                })
            );
        }
    },
    hBtnEnable: function (btn) {
        const me = this,
            record = btn.lookupViewModel().get('record'),
            fields = ['enabled'],
            values = {
                id: record.get('id'),
                version: record.get('version'),
                enabled: !record.get('enabled')
            };
        PortalApp.data.api.entity.EntityCRUDApi.patch({
            application: 'organization',
            domainType: 'org.psr.platform.organization.entity.OrganizationEntity',
            fields: fields,
            values: values,
            success: function (data) {
                PSR.util.Message.info('保存成功');
                me.loadData();
            }
        });
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
                useId: viewModel.get('organizationUseId'),
                parentId: currentNode.get('id'),
                left: 0,
                content: [],
                expanded: true,
                leaf: false
            })
        );
        currentNode.expand();
        newNode.set('code', 'new-' + now);
        newNode.set('description', '新组织-' + now);
        plgRowediting.startEdit(newNode, 1);
    },
    onGrdBeforeEdit: function (editor, context) {
        return context.record.get('id') != 'root-org' && (context.colIdx >= 1 && context.colIdx <= 4);
    },
    onGrdEdit: function (editor, context) {
        const me = this,
            record = context.record,
            newValues = {
                code: context.newValues.code,
                description: context.newValues.description
            };
        if (record.get('version') == undefined) {
            newValues.useId = record.get('useId');
            if (record.get('parentId') != 'root-org') {
                newValues.parentId = record.get('parentId');
            }
            PortalApp.data.api.organization.OrganizationApi.create({
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
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.OrganizationEntity',
                fields: ['code', 'description'],
                values: newValues,
                success: function (data) {
                    PSR.util.Message.info('保存成功');
                    me.loadData();
                }
            })
        }
    },
    hBtnRemove: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            store = grid.getStore(),
            record = store.getAt(rowIndex);
        if (record.get('version') != null) {
            PSR.util.Message.confirm('删除:' + record.get('code'), function () {
                view.mask('处理中...');
                PortalApp.data.api.organization.OrganizationApi.delete({
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
    hBtnUser: function (grid, rowIndex) {
        const me = this,
            view = this.getView(),
            record = grid.getStore().getAt(rowIndex);
        view.fireEvent('switchview', {
            viewId: 'organizationconsole-organization-userview-' + record.get('id'),
            title: '组织用户:' + record.get('code'),
            iconCls: 'x-fa fa-user',
            viewConfig: {
                xtype: 'organizationconsole-organization-userview',
                organization: record,
            },
        })
    },
});
