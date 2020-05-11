Ext.define('PSR.clientSite.data.File', {
    alternateClassName: ['PSR.clientSite.File'],
    singleton: true,
    download: function (opt) {
        if (!opt) {
            return;
        }
        var token = PSR.ClientSite.getClientToken(function (token) {
            PSR.clientSite.File.download(opt);
        });
        if (token) {
            opt.params = Object.assign(
                {},
                opt.params,
                {access_token: token.access_token});
            PSR.data.File.download(opt);
        }
    }
});
