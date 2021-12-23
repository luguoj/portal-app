Ext.define('PortalApp.view.authorizationConsole.authority.GroupView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-authority-groupview',
    config: {
        authority: null
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
    updateAuthority: function (value) {
        this.getViewModel().set('authority', value);
        this.getController().loadData();
    },
    controller: 'authorizationconsole-authority-groupviewcontroller',
    viewModel: {
        data: {
            authority: null
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
            groupAuthorities: {
                groupField: 'catalog',
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.GroupAuthorityEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});