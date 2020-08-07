Ext.define('PSR.Util', {
    singleton: true,
    textMeasureCanvas: document.createElement('canvas'),
    getTextWidth: function (text, font) {
        const context = this.textMeasureCanvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    }
});
