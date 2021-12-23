Ext.define('PortalApp.view.portalConsole.module.ResourceFileView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editor-resourcefileview',
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
            editRenderer: function () {
                return '';
            }
        }, {
            dataIndex: 'catalog',
            flex: 1,
            editor: {
                emptyText: '目录',
                allowBlank: false
            }
        }, {
            xtype: 'actioncolumn',
            items: [{
                iconCls: 'x-fa fa-trash',
                altText: '删除',
                tooltip: '删除',
                handler: 'hBtnRemove'
            }, {
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
        bind: {store: '{resourceFiles}'},
        listeners: {
            edit: 'onGrdEdit'
        }
    }],
    updateModule: function (module) {
        this.getViewModel().set('module', module);
        this.getController().loadData();
    },
    controller: 'portalconsole-module-editor-resourcefileviewcontroller',
    viewModel: {
        data: {
            module: null
        },
        stores: {
            resourceFiles: {
                fields: ['id', 'version', 'moduleId', 'resourceFileId', 'catalog', 'file'],
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleResourceEntity',
                autoLoad: false,
                sorters: [{property: 'catalog', direction: 'ASC'}]
            }
        }
    }
});