Ext.define('PSR.Util', {
    singleton: true,
    textMeasureCanvas: document.createElement('canvas'),
    getTextWidth: function (text, font) {
        const canvas = this.textMeasureCanvas;
        var context = canvas.getContext("2d");
        context.font = font;
        var metrics = context.measureText(text);
        return metrics.width;
    },
    getGridCellTextWidth: function (text) {
        return this.getTextWidth(text, '400 13px/16px Roboto, sans-serif');
    }

});
