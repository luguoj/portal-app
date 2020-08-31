Ext.define('PSR.view.dialog.Import', {
    xtype: 'psr-dialog-import',
    extend: 'Ext.Dialog',
    width: 1000, height: '80%',
    layout: 'vbox', padding: 0,
    config: {
        saveHandler: null,
        columns: []
    },
    items: [{
        xtype: 'psr-toolbar-navigation',
        title: '导入',
        items: [{
            xtype: 'psr-button-reset',
            align: 'right',
            handler: function () {
                this.up('psr-dialog-import').onChange();
            }
        }, {
            xtype: 'psr-button-save',
            align: 'right',
            handler: function () {
                this.up('psr-dialog-import').onSave();
            }
        }],
        goBackHandler: function () {
            this.up('psr-dialog-import').close();
        }
    }, {
        xtype: 'toolbar', docked: 'top',
        items: [{
            xtype: 'filefield', flex: 1,
            name: 'file',
            placeholder: '选择文件', required: true, multiple: true,
            listeners: {
                change: function () {
                    this.up('psr-dialog-import').onChange();
                }
            }
        }]
    }, {
        xtype: 'grid', flex: 1,
        border: true, rowLines: true, columnLines: true,
        columns: [],
        store: {
            data: []
        }
    }, {
        xtype: 'psr-dialog-progress'
    }],
    constructor: function (config) {
        this.callParent([config]);
        const grid = this.down('grid'),
            columns = this.getColumns();
        columns.unshift({
            text: '导入', dataIndex: 'importStatus', width: 51,
            menuDisabled: true,
            cell: {
                encodeHtml: false
            },
            renderer: function (value, record) {
                let cls = '',
                    importMessage = record.get('importMessage');
                if (value) {
                    if (value == 'importing') {
                        cls = 'x-fa fa-spinner fa-spin';
                    } else if (value == 'success') {
                        cls = 'x-fa fa-check-circle p-confirm';
                    } else if (value == 'failure') {
                        cls = 'x-fa fa-times-circle p-decline';
                    }
                }
                return '<div class="x-treecell x-icon-el x-font-icon ' + cls + '"></div>' + (importMessage ? importMessage : '');
            }
        });
        grid.setColumns(columns);
    },
    load: function (opt) {
        this.params = opt.params;
    },
    onChange: function () {
        const me = this,
            grid = me.down('grid'),
            filefield = me.down('filefield'),
            dlgprogress = me.down('psr-dialog-progress'),
            store = grid.getStore(),
            files = filefield.getFiles();
        if (!files || files.length <= 0) {
            return
        }
        if (files && files.length > 0) {
            const total = files.length,
                reader = new FileReader();
            let loaded = 0;
            dlgprogress.setTotal(total);
            dlgprogress.setProgress(loaded);
            store.removeAll();
            reader.addEventListener("load", function () {
                try {
                    const records = JSON.parse(reader.result);
                    if (records && records.length > 0) {
                        for (let i = 0; i < records.length; i++) {
                            const record = Object.assign({}, records[i]);
                            store.add(records[i]);
                        }
                    }
                } catch (e) {
                    PSR.Message.info("文件读取失败：" + files[0].name);
                }
                loaded++;
                dlgprogress.setProgress(loaded);
                if (loaded != total) {
                    reader.readAsText(files[loaded]);
                } else {
                    dlgprogress.setTotal(0);
                    dlgprogress.setProgress(0);
                }
            }, false);
            reader.readAsText(files[0]);
        }
    },
    onSave: function () {
        const me = this,
            grid = me.down('grid'),
            dlgprogress = me.down('psr-dialog-progress'),
            params = me.params,
            store = grid.getStore(),
            records = store.getData().items;
        if (!records || records.length == 0) {
            PSR.Message.info("没有数据");
            return;
        }
        for (let i = 0; i < records.length; i++) {
            records[i].set('importStatus', 'importing');
            records[i].set('importMessage', '导入中');
        }
        dlgprogress.setTotal(records.length);
        dlgprogress.setProgress(0);
        me.doSave({
            records: records,
            params: params,
            recordIndex: 0,
            progress: function (progress) {
                dlgprogress.setProgress(progress);
            },
            complete: function () {
                dlgprogress.setTotal(0);
                dlgprogress.setProgress(0);
            }
        });
    },
    doSave: function (opt) {
        const me = this,
            saveHandler = me.getSaveHandler(),
            records = opt.records,
            params = opt.params,
            recordIndex = opt.recordIndex,
            progress = opt.progress,
            complete = opt.complete,
            record = opt.records[recordIndex],
            values = Object.assign({}, record.data, params);
        record.set('importStatus', 'importing');
        saveHandler({
            values: values,
            success: function (respObj) {
                record.set('importStatus', 'success');
                record.set('importMessage', '导入成功');
            },
            failure: function (respObj) {
                record.set('importStatus', 'failure');
            },
            complete: function () {
                progress(recordIndex + 1);
                if (recordIndex < records.length - 1) {
                    me.doSave(Object.assign({}, opt, {recordIndex: recordIndex + 1}));
                } else {
                    complete();
                }
            },
            onErrorMessage: function (message) {
                record.set('importMessage', message);
            }
        });
    }

});