Ext.define('PortalApp.view.authorizationConsole.group.UserView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-group-userview',
    config: {
        group: null
    },
    layout: {
        type: 'hbox', align: 'stretch'
    },
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }]
    },
    items: [{
        xtype: 'grid',
        flex: 1,
        frame: true,
        plugins: {
            gridfilters: true
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
                    iconCls: '{record.granted?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            flex: 1,
            text: '所有用户',
            dataIndex: 'id',
            filter: 'string'
        }],
        bind: {
            store: '{users}',
        }
    }, {
        xtype: 'grid',
        flex: 1,
        frame: true,
        columns: [{
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                handler: 'hBtnDisable',
                bind: {
                    iconCls: 'x-fa fa-times psr-color-decline'
                }
            }
        }, {
            flex: 1,
            text: '授权用户',
            dataIndex: 'userId',
        }],
        bind: {
            store: '{groupUsers}',
        }
    }],
    updateGroup: function (value) {
        this.getViewModel().set('group', value);
        this.getController().loadData();
    },
    controller: 'authorizationconsole-group-userviewcontroller',
    viewModel: {
        data: {
            group: null
        },
        stores: {
            users: {
                fields: ['id', 'granted'],
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserEntity',
                autoLoad: false,
                pageSize: 50,
                remoteSort: true,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            groupUsers: {
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