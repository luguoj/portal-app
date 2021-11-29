Ext.define('PSR.view.console.file.FileView', {
    extend: 'Ext.panel.Panel',
    xtype: 'psr-view-console-file-fileview',
    controller: 'psr-console-file-fileviewcontroller',
    viewModel: 'psr-console-file-fileviewmodel',
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
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s.u',
            width: 170,
            resizable: false
        }, {
            text: '最后修改日期',
            dataIndex: 'lastModifiedDate',
            xtype: 'datecolumn',
            format: 'Y-m-d H:i:s.u',
            width: 170,
            resizable: false
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