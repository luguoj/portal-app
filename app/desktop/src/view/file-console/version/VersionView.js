Ext.define('PortalApp.view.fileConsole.VersionView', {
    extend: 'Ext.panel.Panel',
    xtype: 'fileconsole-versionview',
    controller: 'fileconsole-versionviewcontroller',
    viewModel: 'fileconsole-versionviewmodel',
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
            xtype: 'psr-datecolumn'
        }, {
            text: '最后修改日期',
            dataIndex: 'lastModifiedDate',
            xtype: 'psr-datecolumn'
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
            xtype: 'actioncolumn',
            width: 40,
            resizable: false,
            menuDisabled: true,
            items: [{
                iconCls: 'x-fa fa-download',
                altText:'下载',
                tooltip: '下载',
                handler: 'hBtnDownload'
            }]
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