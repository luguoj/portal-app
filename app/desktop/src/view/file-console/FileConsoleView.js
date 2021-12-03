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
            xtype: 'actioncolumn',
            width: 67,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-download',
                altText:'下载',
                tooltip: '下载',
                handler: 'hBtnDownload',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('fileVersionId');
                }
            }, {
                iconCls: 'x-fa fa-file-archive',
                altText:'版本',
                tooltip: '版本',
                handler: 'hBtnVersion',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return !record.get('fileVersionId');
                }
            }]
        }],
        bind: {
            store: '{files}'
        }
    }]
});