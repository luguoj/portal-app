Ext.define('PortalApp.view.portalConsole.group.GroupUserView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-groupuserview',
    config: {
        group: null
    },
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }]
    },
    layout: {
        type: 'hbox', align: 'stretch'
    },
    items: [{
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
                iconCls: 'x-fa fa-file',
                handler: 'hBtnEnable',
                bind: {
                    iconCls: '{record.granted?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            flex: 1,
            text: '所有用户',
            dataIndex: 'id',
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
                iconCls: 'x-fa fa-file',
                handler: 'hBtnDisable',
                bind: {
                    iconCls: 'x-fa fa-times psr-color-decline'
                }
            }
        }, {
            flex: 1,
            text: '分组用户',
            dataIndex: 'userId',
        }],
        bind: {
            store: '{groupUsers}',
        }
    }],
    updateGroup: function (value) {
        this.getViewModel().set('group', value);
        if (this.rendered) {
            this.getController().loadData();
        }
    },
    controller: 'portalconsole-group-groupuserviewcontroller',
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
                listeners: {
                    load: 'onDataLoad'
                }
            },
            groupUsers: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.UserGroupEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});