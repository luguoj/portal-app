Ext.define('PortalApp.view.authorizationConsole.client.AuthorityView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-client-authorityview',
    config: {
        client: null
    },
    layout: 'fit',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }]
    },
    items: [{
        xtype: 'grid',
        features: [{
            ftype: 'grouping',
            groupHeaderTpl: '{name} ({rows.length})',
        }],
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
                    iconCls: '{record.granted?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
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
            }
        }, {
            text: '描述',
            dataIndex: 'description',
            menuDisabled: true,
            flex: 1
        }, {
            text: '目录',
            dataIndex: 'catalog',
            menuDisabled: true,
            flex: 1
        }],
        bind: {
            store: '{authorities}'
        }
    }],
    updateClient: function (value) {
        this.getViewModel().set('client', value);
        this.getController().loadData();
    },
    controller: 'authorizationconsole-client-authorityviewcontroller',
    viewModel: {
        data: {
            client: null
        },
        stores: {
            authorities: {
                groupField: 'catalog',
                fields: ['id', 'version', 'catalog', 'description', 'granted'],
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.AuthorityEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            clientAuthorities: {
                groupField: 'catalog',
                type: 'entity',
                application: 'authorization',
                domainType: 'org.psr.platform.authorization.entity.ClientAuthorityEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});