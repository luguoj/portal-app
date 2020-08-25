Ext.define('PSR.Util', {
    singleton: true,
    textMeasureCanvas: document.createElement('canvas'),
    getTextWidth: function (text, font) {
        const context = this.textMeasureCanvas.getContext("2d");
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
    },
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
