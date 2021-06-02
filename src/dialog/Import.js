Ext.define('PSR.view.dialog.Import', {
    xtype: 'psr-dialog-import',
    extend: 'Ext.Dialog',
    width: 1000, height: '80%',
    layout: 'vbox', padding: 0,
    config: {
        reader: {
            type: 'json',
            transform: function (data) {
                return data;
            },
            extractor: null,
            fileReader: null
        },
        handler: null,
        columns: [],
        accept: null
    },
    constructor: function (config) {
        const me = this,
            accept = config.accept || this.config.accept,
            column = [].concat(this.config.columns, config.columns),
            handler = config.handler || this.config.handler;
        config.items = [{
            xtype: 'psr-toolbar-navigation',
            title: '导入',
            items: [{
                xtype: 'psr-button-reset',
                align: 'right',
                handler: function () {
                    me.onChange();
                }
            }, {
                xtype: 'psr-button-save',
                align: 'right',
                handler: function () {
                    me.onSave();
                }
            }],
            goBackHandler: function () {
                me.close();
            }
        }, {
            xtype: 'toolbar', docked: 'top',
            items: [{
                xtype: 'filefield', flex: 1,
                name: 'file', accept: accept,
                placeholder: '选择文件', required: true, multiple: true,
                listeners: {
                    change: function () {
                        me.onChange();
                    }
                }
            }]
        }, {
            xtype: 'psr-panel-batchexecutor', flex: 1,
            border: true,
            columns: column,
            store: {
                data: []
            },
            handler: handler
        }, {
            xtype: 'psr-dialog-progress'
        }];
        config.reader = Object.assign({}, this.config.reader, config.reader);
        this.callParent([config]);
    },
    load: function (opt) {
        this.params = opt.params;
    },
    onChange: function () {
        const me = this,
            reader = me.getReader(),
            readerType = reader.type,
            readerFileReader = reader.fileReader ? reader.fileReader : PSR.view.dialog.Import.fileReaders[readerType],
            readerExtractor = reader.extractor ? reader.extractor : PSR.view.dialog.Import.extractors[readerType],
            readerTransform = reader.transform,
            grid = me.down('psr-panel-batchexecutor'),
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
            reader.addEventListener("load", function (e) {
                try {
                    const data = readerTransform(readerExtractor(reader.result));
                    if (data && data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            store.add(data[i]);
                        }
                    }
                } catch (e) {
                    PSR.Message.info("文件读取失败：" + files[0].name);
                }
                loaded++;
                dlgprogress.setProgress(loaded);
                if (loaded != total) {
                    readerFileReader(files[loaded], reader);
                } else {
                    dlgprogress.setTotal(0);
                    dlgprogress.setProgress(0);
                }
            }, false);
            readerFileReader(files[0], reader);
        }
    },
    onSave: function () {
        const me = this,
            grid = me.down('psr-panel-batchexecutor'),
            dlgprogress = me.down('psr-dialog-progress'),
            params = me.params,
            store = grid.getStore(),
            records = store.getData().items;
        grid.execute();
    },
    statics: {
        extractors: {
            json: function (readerResult) {
                return JSON.parse(readerResult);
            },
            xlsx: function (readerResult) {
                return PSR.util.Xlsx.extractData(readerResult)
            }
        },
        fileReaders: {
            json: function (file, reader) {
                return reader.readAsText(file);
            },
            xlsx: function (file, reader) {
                return reader.readAsBinaryString(file);
            }
        }
    }
});
