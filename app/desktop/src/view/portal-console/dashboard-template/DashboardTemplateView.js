Ext.define('PortalApp.view.portalConsole.DashboardTemplateView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-dashboardtemplateview',
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
            text: '有效',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                handler: 'hBtnEnable',
                bind: {
                    hidden: '{!record.isRecord}',
                    iconCls: '{record.enabled?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            text: '编码',
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'code',
            renderer: function (value, metaData, record) {
                if (record.get('version') == null && record.get('isRecord')) {
                    return record.get('text') + '<b class="psr-color-decline"> (*)</b>';
                } else {
                    return record.get('text');
                }
            },
            editor: {
                allowBlank: false,
                emptyText: '编码'
            }
        }, {
            text: '描述',
            dataIndex: 'description',
            flex: 1,
            editor: {
                allowBlank: false,
                emptyText: '描述'
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-plus',
                altText: '添加',
                tooltip: '添加',
                handler: 'hBtnAdd',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.dirty && record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-edit',
                altText: '编辑',
                tooltip: '编辑',
                handler: 'hBtnEdit',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('isRecord') || record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('isRecord');
                }
            }]
        }],
        bind: {
            store: '{dashboardTemplateTree}',
            disabled: '{!portalId}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'portalconsole-dashboardtemplateviewcontroller',
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
            dashboardTemplateTree: {
                fields: ['id', 'version', 'code', 'description', 'enabled', 'text', 'isRecord'],
                type: 'entitytree',
                transform: 'pathTree',
                pathField: 'code',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
                rootText: '概览模板',
                autoLoad: false
            }
        }
    }
});