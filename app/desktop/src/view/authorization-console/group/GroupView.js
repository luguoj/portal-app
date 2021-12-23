Ext.define('PortalApp.view.authorizationConsole.GroupView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-groupview',
    layout: 'fit',
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
                iconCls: 'x-fa fa-shield-alt',
                altText: '分组权限',
                tooltip: '分组权限',
                handler: 'hBtnAuthority',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-user',
                altText: '分组用户',
                tooltip: '分组用户',
                handler: 'hBtnUser',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-plus',
                altText: '添加',
                tooltip: '添加',
                handler: 'hBtnAdd',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.dirty && record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-copy',
                altText: '克隆',
                tooltip: '克隆',
                handler: 'hBtnClone',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
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
            store: '{groupTree}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'authorizationconsole-groupviewcontroller',
    viewModel: {
        stores: {
            groupTree: {
                fields: ['id', 'version', 'code', 'description', 'enabled', 'text', 'isRecord'],
                type: 'entitytree',
                transform: 'pathTree',
                pathField: 'code',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.GroupEntity',
                rootText: '分组',
                autoLoad: true
            }
        }
    }
});