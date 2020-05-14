Ext.define('PSR.grid.cell.Href', {
    extend: 'Ext.grid.cell.Cell',
    xtype: 'psr-grid-cell-href',
    config: {
        handler: null
    },
    isRecord: function (record) {
        return true;
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
