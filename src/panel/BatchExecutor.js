Ext.define('PSR.panel.BatchExecutor', {
    xtype: 'psr-panel-batchexecutor',
    extend: 'Ext.grid.Grid',
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
        me.dlgProcess = this.add({
            xtype: 'psr-dialog-progress', interruptiable: true,
            listeners: {
                interrupt: function () {
                    me.executeStatus = 'interrupt';
                }
            }
        });
    },
    executeStatus: 'complete',
    execute: function (opt) {
        if (!opt
            || !opt.handler
            || this.executeStatus != 'complete') {
            return;
        }
        this.executeStatus = 'waiting';
        const me = this,
            filter = opt.filter,
            handler = opt.handler,
            dlgProgress = me.dlgProcess,
            store = me.getStore();
        let records = [];
        if (filter) {
            for (let i = 0; i < store.getData().items.length; i++) {
                const item = store.getData().items[i];
                if (filter(item)) {
                    records.push(item);
                }
            }
        } else {
            records = store.getData().items;
        }
        if (!records || records.length == 0) {
            PSR.Message.info("没有任务");
            this.executeStatus = 'complete';
            return;
        }
        for (let i = 0; i < records.length; i++) {
            records[i].set('executeStatus', 'waiting');
            records[i].set('executeMessage', '等待中');
        }
        dlgProgress.setTotal(records.length);
        dlgProgress.setProgress(0);
        let timer = setInterval(function () {
            if (me.executeStatus == 'waiting') {
                me.executeStatus = 'executing';
                const record = records[dlgProgress.getProgress()];
                record.set('executeStatus', 'executing');
                record.set('executeMessage', '执行中');
                handler({
                    values: Object.assign({}, record.data),
                    success: function () {
                        record.set('executeStatus', 'success');
                        record.set('executeMessage', '执行成功');
                    },
                    onErrorMessage: function (message) {
                        record.set('executeStatus', 'failure');
                        record.set('executeMessage', message);
                    },
                    complete: function () {
                        dlgProgress.setProgress(dlgProgress.getProgress() + 1);
                        if (me.executeStatus == 'executing') {
                            if (dlgProgress.getProgress() < records.length) {
                                me.executeStatus = 'waiting';
                            } else {
                                me.executeStatus = 'complete';
                            }
                        }
                    }
                });
            } else if (me.executeStatus == 'complete' || me.executeStatus == 'interrupt') {
                clearInterval(timer);
                dlgProgress.setTotal(0);
                dlgProgress.setProgress(0);
                me.executeStatus = 'complete';
            }
        }, 10);
    }
});