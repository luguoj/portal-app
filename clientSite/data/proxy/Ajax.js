Ext.define('PSR.clientSite.data.proxy.Ajax', {
    extend: 'PSR.data.proxy.Ajax',
    alias: 'proxy.psr-clientsite-ajax',
    doRequest: function (operation) {
        var proxy = this;
        var authHeader = PSR.ClientSite.getAuthorizationHeader(function (authHeader) {
            proxy.doRequest(operation);
        });
        if (authHeader) {
            proxy.setHeaders(Object.assign({}, proxy.getHeaders(), authHeader));
            proxy.callParent([operation]);
        }
    }
});
