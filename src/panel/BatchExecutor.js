Ext.define('PSR.panel.BatchExecutor', {
    xtype: 'psr-panel-batchexecutor',
    extend: 'Ext.grid.Grid',
    config: {
        handler: null
    },
    rowLines: true, columnLines: true,
    constructor: function (config) {
        const me = this,
            columns = [].concat(this.config.columns ? this.config.columns : config.columns);
        config.columns = columns;
        if (columns[0].dataIndex != 'executeStatus') {
            columns.unshift({
                text: '状态', dataIndex: 'executeStatus', width: 51,
                menuDisabled: true,
                cell: {
                    encodeHtml: false
                },
                renderer: function (value, record) {
                    let cls = '',
                        executeMessage = record.get('executeMessage');
                    if (value) {
                        if (value == 'waiting') {
                            cls = 'x-fa fa-spinner fa-spin';
                        } else if (value == 'executing') {
                            cls = 'x-fa fa-spinner fa-spin';
                        } else if (value == 'success') {
                            cls = 'x-fa fa-check-circle p-confirm';
                        } else if (value == 'failure') {
                            cls = 'x-fa fa-times-circle p-decline';
                        }
                    }
                    return '<div class="x-treecell x-icon-el x-font-icon ' + cls + '"></div>' + (executeMessage ? executeMessage : '');
                }
            });
        }
        me.callParent([config]);
        me.dlgprocess = this.add({
            xtype: 'psr-dialog-progress'
        });
    },
    execute: function () {
        const me = this,
            dlgprogress = me.dlgprocess,
            params = me.params,
            store = me.getStore(),
            records = store.getData().items;
        if (!records || records.length == 0) {
            PSR.Message.info("没有任务");
            return;
        }
        for (let i = 0; i < records.length; i++) {
            records[i].set('executeStatus', 'waiting');
            records[i].set('executeMessage', '等待中');
        }
        dlgprogress.setTotal(records.length);
        dlgprogress.setProgress(0);
        me.doExecute({
            records: records,
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
    doExecute: function (opt) {
        const me = this,
            handler = me.getHandler(),
            records = opt.records,
            recordIndex = opt.recordIndex,
            progress = opt.progress,
            complete = opt.complete,
            record = opt.records[recordIndex],
            values = Object.assign({}, record.data);
        record.set('executeStatus', 'executing');
        record.set('executeMessage', '执行中');
        Ext.callback(handler, me, [{
            values: values,
            success: function () {
                record.set('executeStatus', 'success');
                record.set('executeMessage', '执行成功');
            },
            onErrorMessage: function (message) {
                record.set('executeStatus', 'failure');
                record.set('executeMessage', message);
            },
            complete: function () {
                progress(recordIndex + 1);
                if (recordIndex < records.length - 1) {
                    me.doExecute(Object.assign({}, opt, {recordIndex: recordIndex + 1}));
                } else {
                    complete();
                }
            }
        }], 0, me);
    },
});