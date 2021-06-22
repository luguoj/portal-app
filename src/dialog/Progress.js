Ext.define('PSR.view.dialog.Progress', {
    extend: 'Ext.Dialog',
    xtype: 'psr-dialog-progress',
    closable: false, padding: 5, width: 300,
    layout: 'hbox',
    items: [{
        xtype: 'progress',
        flex: 1
    }],
    config: {
        progress: 0,
        total: 0,
        interruptible: false
    },
    constructor: function (config) {
        const me = this;
        this.callParent([config]);
        this.barProgress = this.down('progress');
        if (this.getInterruptible()) {
            this.add({width: 5});
            this.btnInterrupt = this.add({
                xtype: 'button',
                iconCls: 'x-fa fa-times-circle', tooltip: '中断',
                ui: 'decline round psr-button-icon-nopadding',
                handler: function () {
                    me.btnInterrupt.setDisabled(true);
                    me.fireEvent('interrupt');
                }
            });
        }
        this.refreshUI();
    },
    updateTotal: function () {
        this.refreshUI()
    },
    updateProgress: function () {
        this.refreshUI()
    },
    afterRender: function () {
        this.refreshUI()
    },
    refreshUI: function () {
        const barProgress = this.barProgress,
            btnInterrupt = this.btnInterrupt,
            total = this.getTotal() ? this.getTotal() : 0,
            progress = this.getProgress() ? this.getProgress() : 0;
        if (barProgress) {
            barProgress.setValue(total != 0 ? progress / total : 0);
            barProgress.setText(progress + ' / ' + total);
        }
        if (total > 0 && total > progress) {
            this.setHidden(false);
        } else {
            this.setHidden(true);
        }
        if (btnInterrupt) {
            btnInterrupt.setDisabled(false);
        }
    }
});
