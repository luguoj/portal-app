Ext.define('PortalApp.view.portalConsole.module.SourceFileView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-sourcefileview',
    config: {
        module: null
    },
    layout: 'fit',
    tools: [{
        iconCls: 'x-fa fa-redo-alt',
        handler: 'hBtnRefresh',
        bind: {disabled: '{!module}'}
    }],
    items: [{
        xtype: 'grid',
        disableSelection: true,
        hideHeaders: true,
        columns: [{
            xtype: 'templatecolumn',
            width: 44,
            resizable: false,
            menuDisabled: true,
            tpl: [
                '<tpl if="this.isReady(file)">',
                '<div class="psr-cell-icon x-fa fa-check psr-color-confirm"></div>',
                '<tpl else>',
                '<div class="psr-cell-icon x-fa fa-times psr-color-decline"></div>',
                '</tpl>',
                {
                    isReady: function (file) {
                        return file && file.fileVersionId;
                    }
                }
            ],
        }, {
            dataIndex: 'text',
            flex: 1
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-upload',
                altText: '上传',
                tooltip: '上传',
                handler: 'hBtnUpload',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('file') == undefined;
                }
            }, {
                iconCls: 'x-fa fa-download',
                altText: '下载',
                tooltip: '下载',
                handler: 'hBtnDownload',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('file') == undefined || !record.get('file').fileVersionId;
                }
            }, {
                iconCls: 'x-fa fa-file-archive',
                altText: '版本',
                tooltip: '版本',
                handler: 'hBtnVersion',
                isActionDisabled: function (view, rowIndex, colIndex, item, record) {
                    return record.get('file') == undefined || !record.get('file').fileVersionId;
                }
            }]
        }],
        bind: {
            store: '{sourceFiles}'
        }
    }],
    updateModule: function (module) {
        this.getViewModel().set('module', module);
        this.getController().loadData();
    },
    controller: 'portalconsole-module-editor-sourcefileviewcontroller',
    viewModel: {
        data: {
            module: null
        },
        stores: {
            sourceFiles: {
                data: [
                    {id: 'script', text: '脚本', accept: '.js'},
                    {id: 'style', text: '样式', accept: '.css'}
                ]
            }
        }
    }
});