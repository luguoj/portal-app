Ext.define('PSR.view.console.file.FileVersionView', {
    extend: 'Ext.panel.Panel',
    xtype: 'psr-view-console-file-fileversionview',
    controller: 'psr-console-file-fileversionviewcontroller',
    viewModel: 'psr-console-file-fileversionviewmodel',
    config: {
        fileId: null
    },
    layout: 'fit',
    items: [{
        xtype: 'grid',
        columnLines: true,
        bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            items: [{
                xtype: 'combobox',
                valueField: 'limit',
                displayField: 'limit',
                editable: false,
                queryMode: 'local',
                value: 50,
                store: {
                    fields: ['limit'],
                    data: [[50], [100], [200], [500], [1000], [2000]]
                },
                listeners: {
                    change: 'onCombPageLimitChange'
                }
            }]
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
            text: '文件名',
            dataIndex: 'name',
            width: 70
        }, {
            text: '类型',
            dataIndex: 'contentType',
            width: 70
        }, {
            text: '大小',
            dataIndex: 'size',
            width: 70
        }, {
            text: 'MD5',
            dataIndex: 'md5',
            width: 70
        }, {
            text: '存储服务',
            dataIndex: 'storageService',
            width: 70
        }, {
            xtype: 'widgetcolumn',
            widget: {
                textAlign: 'left',
                xtype: 'button',
                iconCls: 'x-fa fa-file-download',
                handler: 'hBtnDownload',
                bind: {
                    disabled: '{!record.fileVersionId}'
                }
            }
        }],
        bind: {
            store: '{fileVersions}'
        }
    }],
    updateFileId: function () {
        const vm = this.getViewModel(),
            fileVersionStore = vm.getStore('fileVersions'),
            fileId = this.getFileId();
        if (fileVersionStore) {
            fileVersionStore.clearFilter(true);
            fileVersionStore.removeAll();
            if (fileId) {
                fileVersionStore.addFilter({property: 'fileId', value: fileId, operator: '=='}, true);
                fileVersionStore.loadPage(1);
            }
        }
    }
});