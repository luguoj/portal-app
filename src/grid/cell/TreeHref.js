Ext.define('PSR.grid.cell.TreeHref', {
    extend: 'Ext.grid.cell.Tree',
    xtype: 'psr-grid-cell-treehref',
    config: {
        handler: null
    },
    isRecord: function (record) {
        return record && record.data && record.data.isRecord;
    },
    actionDom: null,
    applyRawValue: function (rawValue) {
        const dom = this.bodyElement.dom,
            value = rawValue == null ? '' : rawValue,
            me = this,
            record = this.getRecord(),
            handler = this.getHandler();
        let actionDom = this.actionDom;
        if (this.isRecord(record) && value && value.trim()) {
            if (!actionDom) {
                dom.innerHTML = '<a href="javascript:void(0)"></a>'
                actionDom = this.actionDom = dom.firstChild;
                if (handler) {
                    actionDom.onclick = function () {
                        Ext.callback(handler, me.getScope(), [me.getRecord()], 0, me);
                    };
                }
                this.updateRawValue(value);
            }
        } else {
            if (actionDom) {
                dom.innerHTML = '';
                this.actionDom = null;
                this.updateRawValue(value);
            }
        }
        return value;
    },
    updateRawValue: function (rawValue) {
        const actionDom = this.actionDom,
            dom = actionDom ? actionDom : this.bodyElement.dom,
            value = rawValue == null ? '' : rawValue;

        if (this.getEncodeHtml()) {
            dom.textContent = value;
        } else {
            dom.innerHTML = value;
        }
    }
});
