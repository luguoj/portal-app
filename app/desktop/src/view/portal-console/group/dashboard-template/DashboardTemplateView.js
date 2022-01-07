Ext.define('PortalApp.view.portalConsole.group.DashboardTemplateView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-dashboardtemplateview',
    config: {
        group: null
    },
    layout: 'fit',
    tbar: {
        items: ['门户:', {
            xtype: 'combobox',
            allowBlank: false,
            emptyText: '选择门户',
            editable: false,
            valueField: 'id',
            displayField: 'description',
            bind: {store: '{portals}'},
            listeners: {
                change: 'onCombPortalChange'
            }
        }, {
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
            xtype: 'treecolumn',
            flex: 1,
            text: '标题',
            dataIndex: 'text'
        }],
        bind: {
            store: '{dashboardTemplateTree}',
            disabled: '{!portalId}'
        }
    }],
    updateGroup: function (value) {
        this.getViewModel().set('group', value);
        this.getController().loadData();
    },
    controller: 'portalconsole-group-dashboardtemplateviewcontroller',
    viewModel: {
        data: {
            portalId:null
        },
        stores: {
            portals: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.PortalEntity',
                autoLoad: true
            },
            dashboardTemplateTree: {
                fields: ['id', 'version', 'code', 'description', 'enabled', 'text', 'isRecord'],
                type: 'entitytree',
                transform: 'pathTree',
                pathField: 'code',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.DashboardTemplateEntity',
                rootText: '概览模板',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            groupDashboardTemplates: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupDashboardTemplateEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});