Ext.define('PSR.util.LocalFile', {
    singleton: true,
    write: function (name, data, type) {
        const element = document.createElementNS("http://www.w3.org/1999/xhtml", "a"),
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