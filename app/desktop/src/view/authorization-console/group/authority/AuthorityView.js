Ext.define('PortalApp.view.authorizationConsole.group.AuthorityView', {
    extend: 'Ext.panel.Panel',
    xtype: 'authorizationconsole-group-authorityview',
    config: {
        group: null
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
    updateGroup: function (value) {
        this.getViewModel().set('group', value);
        this.getController().loadData();
    },
    controller: 'authorizationconsole-group-authorityviewcontroller',
    viewModel: {
        data: {
            group: null
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