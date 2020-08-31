Ext.define('PSR.clientSite.data.Ajax', {
    alternateClassName: ['PSR.clientSite.Ajax'],
    singleton: true,
    request: function (opt) {
        var authHeader = PSR.ClientSite.getAuthorizationHeader(function (authHeader) {
            PSR.clientSite.Ajax.request(opt);
        });
        if (authHeader) {
            opt.headers = Object.assign({}, authHeader, opt.headers);
            return PSR.Ajax.request(opt);
        }
    }
});
