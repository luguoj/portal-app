Ext.define('PSR.grid.cell.TreeHref', {
    extend: 'Ext.grid.cell.Tree',
    xtype: 'psr-grid-cell-treehref',
    config: {
        handler: null
    },
    isRecord: function (record) {
        return record && record.data && record.data.isRecord;
    },
    updateRawValue: function (rawValue) {
        var dom = this.bodyElement.dom,
            value = rawValue == null ? '' : rawValue,
            me = this,
            record = this.getRecord(),
            handler = this.getHandler();
        if (this.isRecord(record) && value && value.trim()) {
            if (!dom.firstChild || dom.firstChild.tagName != 'A') {
                dom.innerHTML = '<a href="javascript:void(0)"></a>'
            }
            dom = dom.firstChild;
            if (handler) {
                dom.onclick = function () {
                    Ext.callback(handler, me.getScope(), [record], 0, me);
                };
            }
        }
        if (this.getEncodeHtml()) {
            dom.textContent = value;
        } else {
            dom.innerHTML = value;
        }
    }
});
