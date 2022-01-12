Ext.define('PortalApp.view.portalConsole.dashboard.PartView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-dashboard-partview',
    layout: 'fit',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
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
        rootVisible: false,
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
                    hidden: '{!record.part}',
                    iconCls: '{record.enabled?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            xtype: 'treecolumn',
            flex: 1,
            text: '编码',
            dataIndex: 'code',
            editor: {
                allowBlank: false,
                emptyText: '编码'
            }
        }, {
            flex: 1,
            text: '描述',
            dataIndex: 'description',
            editor: {
                allowBlank: false,
                emptyText: '描述'
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-plus',
                altText: '添加部件',
                tooltip: '添加部件',
                handler: 'hBtnAdd',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('module')
                }
            }, {
                iconCls: 'x-fa fa-edit',
                altText: '编辑',
                tooltip: '编辑',
                handler: 'hBtnEdit',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('part') || record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('part');
                }
            }]
        }],
        bind: {
            store: '{modulePartTree}',
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'portalconsole-dashboard-partviewcontroller',
    viewModel: {
        data: {},
        stores: {
            modulePartTree: {
                fields: ['id', 'version', 'module', 'part', 'expanded', 'leaf', 'code', 'description', 'enable'],
                type: 'tree',
                root: {
                    expanded: true
                }
            },
            modules: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            parts: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardPartEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
        }
    }
});