Ext.define('PortalApp.view.portalConsole.ModuleView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-moduleview',
    layout: 'fit',
    tbar: {
        items: [{
            text: '添加',
            iconCls: 'x-fa fa-plus',
            handler: 'hBtnAdd'
        }, {
            xtype: 'button',
            text: '删除',
            iconCls: 'x-fa fa-trash-alt',
            disabled: true,
            handler: 'hBtnRemove'
        }]
    },
    items: [{
        xtype: 'grid',
        columnLines: true,
        bbar: {
            xtype: 'psr-pagingtoolbar',
            displayInfo: true
        },
        columns: [{
            text: '有效',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                iconCls: 'x-fa fa-file',
                handler: 'hBtnEnabled',
                bind: {
                    iconCls: '{record.enabled?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            text: '主键标识',
            dataIndex: 'id',
            width: 70
        }, {
            text: '编码',
            dataIndex: 'code',
            width: 70
        }, {
            text: '描述',
            dataIndex: 'description',
            width: 70
        }, {
            text: '设备',
            dataIndex: 'device',
            width: 70
        }, {
            text: '创建日期',
            dataIndex: 'createdDate',
            xtype: 'psr-datecolumn',
            hidden: true
        }, {
            text: '最后修改日期',
            dataIndex: 'lastModifiedDate',
            xtype: 'psr-datecolumn',
            hidden: true
        },{
            xtype:'actioncolumn',
            width: 40,
            resizable: true,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-trash psr-decline',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove'
            }]
        }],
        bind: {
            store: '{modules}'
        },
        listeners: {
            itemdblclick: 'onGrdItemDbClick',
            selectionchange: 'onGrdSelectionChange'
        }
    }],
    controller: 'portalconsole-moduleviewcontroller',
    viewModel: {
        stores: {
            modules: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                pageSize: 50,
                remoteSort: true,
                remoteFilter: true,
                autoLoad: true
            }
        }
    }
});