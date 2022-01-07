Ext.define('PortalApp.view.dashboard.DashboardView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboardview',
    layout: {type: 'vbox', align: 'stretch'},
    scrollable: 'y',
    tbar: {
        items: ['模板:', {
            xtype: 'treepicker',
            flex: 1,
            valueField: 'id',
            displayField: 'code',
            rootVisible: false,
            emptyText: '选择模板',
            columns: [{
                xtype: 'treecolumn',
                flex: 1,
                dataIndex: 'code',
                renderer: function (value, metaData, record) {
                    if (record.get('isRecord')) {
                        return '<u><b>' + record.get('text') + '</b></u>';
                    } else {
                        return record.get('text');
                    }
                },
            }],
            bind: {
                store: '{dashboardTemplateTree}'
            },
            onItemClick: function (view, record, node, rowIndex, e) {
                if (record.get('isRecord')) {
                    this.selectItem(record);
                }
            },
            listeners: {
                select: 'onTreePickSelect'
            }
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }],
        bind: {
            hidden: '{fullscreen}'
        }
    },
    items: [],
    controller: 'dashboard-dashboardviewcontroller',
    viewModel: {
        data: {
            dashboardTemplateId: null
        },
        stores: {
            dashboardTemplateTree: {
                fields: ['id', 'version', 'code', 'description', 'enabled', 'text', 'isRecord'],
                type: 'entitytree',
                transform: 'pathTree',
                pathField: 'code',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
                rootText: '概览模板',
                autoLoad: true,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
})
;
