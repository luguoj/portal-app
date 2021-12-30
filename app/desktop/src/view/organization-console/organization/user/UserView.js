Ext.define('PortalApp.view.organizationconsole.organization.UserView', {
    extend: 'Ext.panel.Panel',
    xtype: 'organizationconsole-organization-userview',
    config: {
        organization: null
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
            xtype: 'templatecolumn',
            width: 44,
            resizable: false,
            menuDisabled: true,
            tpl: [
                '<tpl if="this.isMember(statuses)">',
                '<div class="psr-cell-icon x-fa fa-check psr-color-confirm"></div>',
                '</tpl>',
                {
                    isMember: function (statuses) {
                        return statuses && statuses.length > 0;
                    }
                }
            ]
        }, {
            flex: 1,
            text: '所有用户',
            dataIndex: 'id',
            filter: 'string'
        }],
        bind: {
            store: '{users}',
        },
        listeners: {
            selectionchange: 'onGrdUserSelectionChange'
        }
    }, {
        xtype: 'grid', reference: 'grdStatus',
        disabled: true,
        flex: 1,
        frame: true,
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
            text: '身份',
            dataIndex: 'id',
            renderer: function (value, metaData, record) {
                return '<b>[' + record.get('id') + ']</b> ' + record.get('description');
            }
        }],
        bind: {
            store: '{statuses}',
        }
    }],
    updateOrganization: function (value) {
        this.getViewModel().set('organization', value);
        this.getController().loadData();
    },
    controller: 'organizationconsole-organization-userviewcontroller',
    viewModel: {
        data: {
            organization: null,
            user: null
        },
        stores: {
            users: {
                fields: ['id', 'statuses'],
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
            statuses: {
                type: 'entity',
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.StatusEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            userStatuses: {
                type: 'entity',
                application: 'organization',
                domainType: 'org.psr.platform.organization.entity.UserStatusEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});