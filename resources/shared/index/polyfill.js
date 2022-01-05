if (typeof Object.assign != 'function') {
    Object.assign = function (target) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source != null) {
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
        }
        return target;
    };
}
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str) {
        if (str == null || str == '' || this.length == 0 || str.length > this.length)
            return false;
        return this.substr(0, str.length) == str;
    };
}
if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str) {
        if (str == null || str == '' || this.length == 0 || str.length > this.length)
            return false;
        return this.substring(this.length - str.length) == str;
    };
}
Array.prototype.remove = function (obj) {
    let objIndex = this.indexOf(obj);
    if (objIndex >= 0) {
        this.splice(objIndex, 1);
        return true;
    }
    return false;
}