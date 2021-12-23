Ext.define('PortalApp.view.authorizationConsole.user.GroupView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-user-groupview',
    config: {
        user: null
    },
    layout: 'fit',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }]
    },
    items: [{
        xtype: 'treepanel',
        columns: [{
            text: '授权',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                handler: 'hBtnEnable',
                bind: {
                    hidden: '{!record.isRecord}',
                    iconCls: '{record.granted?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            text: '分组',
            xtype: 'treecolumn',
            flex: 1,
            dataIndex: 'code',
            renderer: function (value, metaData, record) {
                if (record.get('isRecord')) {
                    return '<b>[' + record.get('text') + ']</b> ' + record.get('description');
                } else {
                    return record.get('text');
                }
            }
        }, {
            text: '描述',
            dataIndex: 'description',
            flex: 1
        }],
        bind: {
            store: '{groupTree}'
        }
    }],
    updateUser: function (value) {
        this.getViewModel().set('user', value);
        this.getController().loadData();
    },
    controller: 'authorizationconsole-user-groupviewcontroller',
    viewModel: {
        data: {
            user: null
        },
        stores: {
            groupTree: {
                fields: ['id', 'version', 'code', 'description', 'enabled', 'text', 'isRecord'],
                type: 'entitytree',
                transform: 'pathTree',
                pathField: 'code',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.GroupEntity',
                rootText: '分组',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            userGroups: {
                groupField: 'catalog',
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserGroupEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});