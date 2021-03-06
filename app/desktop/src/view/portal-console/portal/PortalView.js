Ext.define('PortalApp.view.portalConsole.PortalView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-portalview',
    layout: 'fit',
    tbar: {
        items: [{
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh'
        }]
    },
    items: [{
        xtype: 'grid',
        columns: [{
            text: '主键标识',
            dataIndex: 'id',
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
            text: '有效',
            dataIndex: 'enabled',
            xtype: 'booleancolumn',
            width: 44,
            resizable: false
        }],
        bind: {
            store: '{portals}'
        }
    }],
    controller: 'portalconsole-portalviewcontroller',
    viewModel:{
        stores: {
            portals: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.PortalEntity',
                autoLoad: false
            }
        }
    }
});