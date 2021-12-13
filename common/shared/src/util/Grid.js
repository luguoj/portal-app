Ext.define('PSR.util.Grid', {
    singleton: true,
    getCellWidth: function (text) {
        return PSR.util.Style.getTextWidth(
            text,
            PSR.util.Style.EXT_FONT_GRID_COLUMN
        ) + 24;
    },
    getColumnWidth: function (text) {
        return this.getCellWidth(text) + 2;
    },
    filterRenderer: function (value, filterText) {
        if (filterText) {
            const rendererRegExp = new RegExp('(' + filterText + ')', "gi");
            return value.replace(rendererRegExp, '<span style="color:red;font-weight:bold">$1</span>')
        } else {
            return value;
        }
        return value;
    },
    recordRenderer: function (value) {
        return '<b><u>' + value + '</u></b>';
    }
});
