Ext.define('PortalApp.view.portalConsole.group.GroupModuleActionView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-groupmoduleactionview',
    config: {
        group: null
    },
    layout: 'fit',
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
        xtype: 'treepanel',
        rootVisible: false,
        columns: [{
            text: '授权',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                iconCls: 'x-fa fa-file',
                handler: 'hBtnEnabled',
                bind: {
                    hidden: '{!record.action}',
                    iconCls: '{record.granted?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            xtype: 'treecolumn',
            flex: 1,
            text: '操作',
            dataIndex: 'text',
            renderer: function (value, metaData, record) {
                if (record.get('module')) {
                    return '<b>[' + record.get('module').get('code') + ']</b> ' + record.get('module').get('description');
                } else if (record.get('action')) {
                    return '<b>[' + record.get('action').get('code') + ']</b> ' + record.get('action').get('description');
                } else {
                    return value;
                }
            }
        }],
        bind: {
            store: '{moduleActionTree}',
        }
    }],
    listeners: {
        afterrender: 'onAfterRendered'
    },
    updateGroup: function (value) {
        this.getViewModel().set('group', value);
        if (this.rendered) {
            this.getController().loadData();
        }
    },
    controller: 'portalconsole-group-groupmoduleactionviewcontroller',
    viewModel: {
        data: {
            group: null
        },
        stores: {
            moduleActionTree: {
                fields: ['id', 'module', 'action', 'granted', 'expanded'],
                type: 'tree',
                root: {
                    expanded: true
                }
            },
            modules: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            actions: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            },
            groupModuleActions: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupModuleActionEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});