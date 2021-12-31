Ext.define('PortalApp.view.dashboard.DashboardView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboardview',
    layout: {type: 'vbox', align: 'stretch'},
    scrollable: 'y',
    tbar: {
        items: ['仪表盘:', {
            xtype: 'combobox',
            bind: {
                disabled: '{editing}'
            }
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }, '|', {
            iconCls: 'x-fa fa-plus',
            handler: 'hBtnAdd'
        }, {
            iconCls: 'x-fa fa-edit',
            enableToggle: true,
            bind: {
                disabled: '{editing}',
                pressed: '{editing}'
            },
            listeners: {
                toggle: 'onBtnEditToggle'
            }
        }, {
            iconCls: 'x-fa fa-save',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            iconCls: 'x-fa fa-times',
            bind: {
                hidden: '{!editing}',
                handler: 'hBtnCancel'
            }
        }],
        bind: {
            hidden: '{fullscreen}'
        }
    },
    items: [{
        xtype: 'dashboard-placeholderview',
        height: '100%',
        resizable: {handles: 's'}
    }],
    controller: 'dashboard-dashboardviewcontroller',
    viewModel: {
        data: {
            editing: false
        }
    }
});
