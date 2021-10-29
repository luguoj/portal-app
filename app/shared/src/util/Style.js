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
    saveAsElement: document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
    saveAs: function (name, data, type) {
        const element = this.saveAsElement,
            ev = document.createEvent("MouseEvents"),
            urlObject = window.URL || window.webkitURL || window,
            export_blob = new Blob([data], {type: type ? type : ''});
        element.href = urlObject.createObjectURL(export_blob);
        element.download = name;
        ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        element.dispatchEvent(ev);
        urlObject.revokeObjectURL(element.href);
        element.href = '';
    }
});