Ext.define('PortalApp.view.authorizationConsole.ClientView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-clientview',
    layout: 'fit',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }, {
            text: '添加',
            iconCls: 'x-fa fa-plus',
            handler: 'hBtnAdd'
        }]
    },
    items: [{
        xtype: 'grid',
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{name} ({rows.length})',
        }],
        plugins: {
            rowediting: {
                clicksToMoveEditor: 1,
                autoCancel: false
            }
        },
        columns: [{
            text: '主键标识',
            dataIndex: 'id',
            menuDisabled: true,
            flex: 1,
            renderer: function (value, metaData, record) {
                if (record.get('version') == null && record.get('isRecord')) {
                    return value + '<b class="psr-color-decline"> (*)</b>';
                } else {
                    return value;
                }
            },
            editor: {
                allowBlank: false,
                emptyText: '主键标识'
            }
        }, {
            text: '描述',
            dataIndex: 'description',
            menuDisabled: true,
            flex: 1,
            editor: {
                allowBlank: false,
                emptyText: '描述'
            }
        }, {
            text: '目录',
            dataIndex: 'catalog',
            menuDisabled: true,
            flex: 1,
            editor: {
                allowBlank: true,
                emptyText: '目录'
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-key',
                altText: '重置密码',
                tooltip: '重置密码',
                handler: 'hBtnResetPassword',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            },{
                iconCls: 'x-fa fa-server',
                altText: '客户端资源',
                tooltip: '客户端资源',
                handler: 'hBtnResource',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-shield-alt',
                altText: '客户端权限',
                tooltip: '客户端权限',
                handler: 'hBtnAuthority',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove'
            }]
        }],
        bind: {
            store: '{clients}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'authorizationconsole-clientviewcontroller',
    viewModel: {
        data: {},
        stores: {
            clients: {
                groupField: 'catalog',
                fields: ['id', 'version', 'catalog', 'description'],
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ClientEntity',
                autoLoad: false
            }
        }
    }
});