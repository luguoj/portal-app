Ext.define('PSR.util.Grid', {
    singleton: true,
    getCellWidth: function (text) {
        return PSR.Util.getTextWidth(text, '400 13px/16px Roboto, sans-serif') + 24;
    },
    getColumnWidth: function (text) {
        return this.getCellWidth(text) + 2;
    }
});
