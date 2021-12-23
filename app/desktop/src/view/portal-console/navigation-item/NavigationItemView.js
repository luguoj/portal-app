Ext.define('PortalApp.view.portalConsole.NavigationItemView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-navigationitemview',
    layout: 'fit',
    tbar: {
        items: ['门户:', {
            xtype: 'combobox',
            allowBlank: false,
            emptyText: '选择门户',
            editable: false,
            valueField: 'id',
            displayField: 'description',
            bind: {store: '{portals}'},
            listeners: {
                change: 'onCombPortalChange'
            }
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh',
            bind: {
                disabled: '{!portalId}'
            }
        }]
    },
    items: [{
        xtype: 'treepanel',
        plugins: {
            rowediting: {
                clicksToMoveEditor: 1,
                autoCancel: false
            }
        },
        columns: [{
            xtype: 'treecolumn',
            flex: 1,
            text: '标题',
            dataIndex: 'text',
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
            text: '图标',
            dataIndex: 'iconCls',
            editor: {
                allowBlank: false,
                emptyText: '图标'
            }
        }, {
            text: '排序',
            dataIndex: 'sort',
            editor: {
                allowBlank: false,
                emptyText: '排序'
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-folder-plus',
                altText: '添加目录',
                tooltip: '添加目录',
                handler: 'hBtnAddCatalog',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('viewConfig')
                        || (record.get('version') == null && record.get('id') != 'root');
                }
            }, {
                iconCls: 'x-fa fa-calendar-plus',
                altText: '添加视图',
                tooltip: '添加视图',
                handler: 'hBtnAddView',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('viewConfig')
                        || (record.get('version') == null && record.get('id') != 'root');
                }
            }, {
                iconCls: 'x-fa fa-edit',
                altText: '编辑',
                tooltip: '编辑',
                handler: 'hBtnEdit',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('isView') || record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('id') == 'root';
                }
            }]
        }],
        bind: {
            store: '{navigationItemTree}',
            disabled: '{!portalId}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'portalconsole-navigationitemviewcontroller',
    viewModel: {
        data: {
            portalId: null
        },
        stores: {
            portals: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.PortalEntity',
                autoLoad: true
            },
            navigationItemTree: {
                fields: ['id', 'version', 'portalId', 'parentId', 'isView', 'text', 'iconCls', 'viewConfig', 'content'],
                type: 'entitytree',
                transform: 'parentTree',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.NavigationItemEntity',
                autoLoad: false,
                rootText: '导航节点',
                sorters: [{property: 'sort', direction: 'ASC'}]
            }
        }
    }
});