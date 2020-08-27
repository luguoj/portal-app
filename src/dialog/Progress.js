Ext.define('PSR.view.dialog.Progress', {
    extend: 'Ext.Dialog',
    xtype: 'psr-dialog-progress',
    closable: false,
    layout: 'vbox',
    items: [{
        xtype: 'progress'
    }],
    config: {
        progress: 0,
        total: 0
    },
    updateTotal: function (total) {
        const progressItem = this.getAt(0),
            progress = this.getProgress() ? this.getProgress() : 0;
        if (progressItem) {
            progressItem.setValue(total != 0 ? progress / total : 0);
            progressItem.setText(progress + ' / ' + total);
        }
        if (total > 0 && total > progress) {
            this.setHidden(false);
        } else {
            this.setHidden(true);
        }
    },
    updateProgress: function (progress) {
        const progressItem = this.getAt(0),
            total = this.getTotal() ? this.getTotal() : 0;
        if (progressItem) {
            progressItem.setValue(total != 0 ? progress / total : 0);
            progressItem.setText(progress + ' / ' + total);
        }
        if (total > 0 && total > progress) {
            this.setHidden(false);
        } else {
            this.setHidden(true);
        }
    }
});
