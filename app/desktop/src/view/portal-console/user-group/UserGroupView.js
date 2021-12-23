Ext.define('PortalApp.view.portalConsole.UserGroupView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-usergroupview',
    layout: {
        type: 'hbox', align: 'stretch'
    },
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh',
            bind: {
                disabled: '{!portalId}'
            }
        }]
    },
    items: [{
        xtype: 'grid',
        frame: true,
        width: 302,
        columns: [{
            text: '用户',
            dataIndex: 'id',
            width: 300
        }],
        bind: {
            store: '{users}'
        },
        listeners: {
            selectionchange: 'onGrdUserSelectionChange'
        }
    }, {
        xtype: 'treepanel',
        disabled: true,
        frame: true,
        flex: 1,
        columns: [{
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
        }],
        bind: {
            store: '{groupTree}'
        }
    }],
    controller: 'portalconsole-usergroupviewcontroller',
    viewModel: {
        data: {
            user: null
        },
        stores: {
            users: {
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.UserEntity',
                autoLoad: true
            },
            groupTree: {
                fields: ['id', 'version', 'code', 'description', 'enabled', 'text', 'isRecord', 'granted'],
                type: 'entitytree',
                transform: 'pathTree',
                pathField: 'code',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupEntity',
                rootText: '分组',
                autoLoad: true,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            userGroups: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.UserGroupEntity',
                autoLoad: false,
                filters: [{
                    property: 'userId',
                    operator: 'isnull',
                }],
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});