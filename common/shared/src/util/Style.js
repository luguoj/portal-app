Ext.define('PSR.util.Style', {
    singleton: true,
    textMeasureCanvas: document.createElement('canvas'),
    getTextWidth: function (text, font) {
        const context = this.textMeasureCanvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return Math.ceil(metrics.width);
    },
    EXT_FONT_ROOT: '400 14px/1.25 Roboto, sans-serif',
    EXT_FONT_BUTTON: '600 14px/16px Roboto, sans-serif',
    EXT_FONT_TEXT_FIELD: '400 13px/16px Roboto, sans-serif',
    EXT_FONT_GRID_COLUMN: '400 13px/16px Roboto, sans-serif',
});