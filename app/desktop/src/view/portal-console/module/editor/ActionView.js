Ext.define('PortalApp.view.portalConsole.module.ActionView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-actionview',
    config: {
        module: null
    },
    bubbleEvents: ['switchview'],
    layout: 'fit',
    tools: [{
        iconCls: 'x-fa fa-redo-alt',
        handler: 'hBtnRefresh',
        bind: {disabled: '{!module}'}
    }, {
        iconCls: 'x-fa fa-plus-circle',
        handler: 'hBtnAdd',
        bind: {disabled: '{!module}'}
    }],
    items: [{
        xtype: 'grid',
        reference: 'grd-resources',
        columnLines: true,
        minHeight: 100,
        disableSelection: true,
        plugins: {
            rowediting: {
                clicksToMoveEditor: 1,
                autoCancel: false
            }
        },
        hideHeaders: true,
        columns: [{
            xtype: 'checkcolumn',
            width: 40,
            dataIndex: 'enabled',
            disabled: true,
            editor: {
                xtype: 'checkboxfield'
            }
        }, {
            dataIndex: 'code',
            flex: 1,
            editor: {
                emptyText: '编码',
                allowBlank: false
            }
        }, {
            dataIndex: 'description',
            flex: 1,
            editor: {
                emptyText: '描述',
                allowBlank: false
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove'
            }]
        }],
        bind: {store: '{actions}'},
        listeners: {
            edit: 'onGrdEdit'
        }
    }],
    updateModule: function (module) {
        this.getViewModel().set('module', module);
        this.getController().loadData();
    },
    controller: 'portalconsole-module-editor-actionviewcontroller',
    viewModel: {
        data: {
            module: null
        },
        stores: {
            actions: {
                fields: ['id', 'version', 'moduleId', 'code', 'description', 'enabled'],
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleActionEntity',
                pageSize: 0,
                remoteFilter: true,
                remoteSort: true,
                autoLoad: false,
                sorters: [{property: 'code', direction: 'ASC'}]
            }
        }
    }
});