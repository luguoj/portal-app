Ext.define('PSR.data.File', {
    alternateClassName: ['PSR.File'],
    singleton: true,
    download: function (opt) {
        if (opt && opt.url) {
            if (opt.withAuthToken) {
                var token = PSR.util.Auth.getClientToken(function (token) {
                    PSR.File.download(opt);
                });
                if (!token) {
                    return;
                }
                opt.params = Object.assign(
                    {},
                    opt.params,
                    {access_token: token.access_token}
                );
            }
            let url = opt.url;
            if (opt.params) {
                if (url.indexOf("?") == -1) {
                    url += "?";
                } else {
                    url += "&";
                }
                url += Ext.Object.toQueryString(opt.params)
            }
            window.open(url);
        }
    }
});
