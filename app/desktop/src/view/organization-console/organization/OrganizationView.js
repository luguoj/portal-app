Ext.define('PortalApp.view.organizationconsole.OrganizationView', {
    extend: 'Ext.panel.Panel',
    xtype: 'organizationconsole-organizationview',
    layout: 'fit',
    tbar: {
        items: ['组织用途:', {
            xtype: 'combobox',
            allowBlank: false,
            emptyText: '选择组织用途',
            editable: false,
            valueField: 'id',
            displayField: 'description',
            bind: {store: '{organizationUses}'},
            listeners: {
                change: 'onCombOrganizationUseChange'
            }
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh',
            bind: {
                disabled: '{!organizationUseId}'
            }
        }]
    },
    items: [{
        xtype: 'treepanel',
        rootVisible: false,
        plugins: {
            rowediting: {
                clicksToMoveEditor: 1,
                autoCancel: false
            }
        },
        columns: [{
            text: '有效',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                handler: 'hBtnEnable',
                bind: {
                    disabled: '{record.parentId=="root"}',
                    iconCls: '{record.enabled?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            xtype: 'treecolumn',
            flex: 1,
            text: '编码',
            dataIndex: 'code',
            renderer: function (value, metaData, record) {
                if (record.get('version') != null || record.get('id') == 'root') {
                    return value;
                } else {
                    return value + '<b class="psr-color-decline"> (*)</b>';
                }
            },
            editor: {
                allowBlank: false,
                emptyText: '标题'
            }
        }, {
            text: '描述',
            width: 200,
            dataIndex: 'description',
            editor: {
                allowBlank: false,
                emptyText: '描述'
            }
        }, {
            text: '左值',
            width: 61,
            dataIndex: 'left',
            editRenderer: function (value) {
                return value;
            }
        }, {
            text: '右值',
            width: 61,
            dataIndex: 'right',
            editRenderer: function (value) {
                return value;
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-folder-plus',
                altText: '添加组织',
                tooltip: '添加组织',
                handler: 'hBtnAddCatalog',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null && record.get('id') != 'root-org';
                }
            }, {
                iconCls: 'x-fa fa-user',
                altText: '组织用户',
                tooltip: '组织用户',
                handler: 'hBtnUser',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null || record.get('parentId') == 'root';
                }
            }, {
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('parentId') == 'root';
                }
            }]
        }],
        bind: {
            store: '{organizationTree}',
            disabled: '{!organizationUseId}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'organizationconsole-organizationviewcontroller',
    viewModel: {
        data: {
            organizationUseId: null
        },
        stores: {
            organizationUses: {
                type: 'entity',
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.OrganizationUseEntity',
                autoLoad: true
            },
            organizationTree: {
                fields: ['id', 'version', 'useId', 'parentId', 'text', 'code', 'description', 'left', 'right'],
                type: 'entitytree',
                transform: 'parentTree',
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.OrganizationEntity',
                autoLoad: false,
                rootText: '组织',
                sorters: [{property: 'left', direction: 'ASC'}],
                listeners: {
                    load: 'onOrganizationTreeLoad'
                }
            }
        }
    }
});