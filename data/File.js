Ext.define('PSR.data.File', {
    alternateClassName: ['PSR.File'],
    singleton: true,
    download: function (opt) {
        if (opt && opt.url) {
            var url = opt.url;
            if (opt.params) {
                if (url.indexOf("?") == -1) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += Ext.Object.toQueryString(opt.params)
            }
        }
        window.open(url);
    },
    upload:function(opt){
        if (opt && opt.url) {
            var url = opt.url;
            if (opt.params) {
                if (url.indexOf("?") == -1) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += Ext.Object.toQueryString(opt.params)
            }
        }
    }
});
