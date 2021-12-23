Ext.define('PortalApp.view.authorizationConsole.UserView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-userview',
    layout: 'fit',
    tbar: {
        items: [{
            text: '添加',
            iconCls: 'x-fa fa-plus',
            handler: 'hBtnAdd'
        }]
    },
    items: [{
        xtype: 'grid',
        plugins: {
            gridfilters: true,
            rowediting: {
                clicksToMoveEditor: 1,
                autoCancel: false
            }
        },
        bbar: {
            xtype: 'psr-pagingtoolbar',
            displayInfo: true
        },
        columns: [{
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                handler: 'hBtnEnable',
                bind: {
                    iconCls: '{record.enabled?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            text: '主键标识',
            dataIndex: 'id',
            flex: 1,
            filter: 'string',
            renderer: function (value, metaData, record) {
                if (record.get('version') != null) {
                    return value;
                } else {
                    return value + '<b class="psr-color-decline"> (*)</b>';
                }
            },
            editor: {
                xtype: 'textfield',
                allowBlank: false,
                emptyText: '主键标识'
            }
        }, {
            text: '创建日期',
            dataIndex: 'createdDate',
            xtype: 'psr-datecolumn',
            hidden: true
        }, {
            text: '最后修改日期',
            dataIndex: 'lastModifiedDate',
            xtype: 'psr-datecolumn',
            hidden: true
        }, {
            text: '账户过期时间',
            dataIndex: 'accountExpiryTime',
            xtype: 'psr-datecolumn',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                emptyText: '账户过期时间'
            }
        }, {
            text: '账户锁定时间',
            dataIndex: 'accountLockExpiryTime',
            xtype: 'psr-datecolumn',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                emptyText: '账户锁定时间'
            }
        }, {
            text: '密码过期间',
            dataIndex: 'passwordExpiryTime',
            xtype: 'psr-datecolumn',
            editor: {
                xtype: 'datefield',
                allowBlank: true,
                emptyText: '密码过期间'
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
            }, {
                iconCls: 'x-fa fa-shield-alt',
                altText: '用户权限',
                tooltip: '用户权限',
                handler: 'hBtnAuthority',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            },{
                iconCls: 'x-fa fa-users',
                altText: '用户分组',
                tooltip: '用户分组',
                handler: 'hBtnGroup',
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
            store: '{users}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'authorizationconsole-userviewcontroller',
    viewModel: {
        stores: {
            users: {
                fields: ['id', 'version'],
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserEntity',
                pageSize: 50,
                remoteSort: true,
                autoLoad: false
            }
        }
    }
});