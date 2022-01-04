Ext.define('PSR.util.Base64', {
    singleton: true,
    encode: function (content, trim) {
        let ciphertext = window.btoa(content);
        if (trim) {
            ciphertext = ciphertext.replaceAll('=', '')
        }
        return ciphertext;
    },
    decode: function (ciphertext) {
        return window.atob(ciphertext);
    }
});