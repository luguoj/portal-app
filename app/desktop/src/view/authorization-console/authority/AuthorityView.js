Ext.define('PortalApp.view.authorizationConsole.AuthorityView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-authorityview',
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
            startCollapsed: true,
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
                iconCls: 'x-fa fa-users',
                altText: '授权分组',
                tooltip: '授权分组',
                handler: 'hBtnGroup',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('version') == null;
                }
            }, {
                iconCls: 'x-fa fa-user',
                altText: '授权用户',
                tooltip: '授权用户',
                handler: 'hBtnUser',
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
            store: '{authorities}'
        },
        listeners: {
            beforeedit: 'onGrdBeforeEdit',
            edit: 'onGrdEdit'
        }
    }],
    controller: 'authorizationconsole-authorityviewcontroller',
    viewModel: {
        data: {},
        stores: {
            authorities: {
                groupField: 'catalog',
                fields: ['id', 'version', 'catalog', 'description'],
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.AuthorityEntity',
                autoLoad: false
            }
        }
    }
});