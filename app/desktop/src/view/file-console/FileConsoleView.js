Ext.define('PortalApp.view.fileConsole.FileConsoleView', {
    extend: 'Ext.panel.Panel',
    xtype: 'fileconsoleview',
    controller: 'fileconsoleviewcontroller',
    viewModel: 'fileconsoleviewmodel',
    layout: 'fit',
    items: [{
        xtype: 'grid',
        columnLines: true,
        bbar: {
            xtype: 'psr-pagingtoolbar',
            displayInfo: true
        },
        columns: [{
            text: '主键标识',
            dataIndex: 'id',
        }, {
            text: '创建日期',
            dataIndex: 'createdDate',
            xtype: 'psr-datecolumn'
        }, {
            text: '最后修改日期',
            dataIndex: 'lastModifiedDate',
            xtype: 'psr-datecolumn'
        }, {
            text: '存储服务',
            dataIndex: 'storageService',
            width: 70
        }, {
            text: '废弃',
            dataIndex: 'abandoned',
            xtype: 'booleancolumn',
            width: 44,
            resizable: false
        }, {
            text: '下载',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                iconCls: 'x-fa fa-file-download',
                handler: 'hBtnDownload',
                bind: {
                    disabled: '{!record.fileMetaId}'
                }
            }
        }, {
            text: '版本',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                iconCls: 'x-fa fa-file-archive',
                handler: 'hBtnVersion',
                bind: {
                    hidden: '{!record.versionControl}',
                    disabled: '{!record.fileMetaId}'
                }
            }
        }],
        bind: {
            store: '{files}'
        }
    }]
});