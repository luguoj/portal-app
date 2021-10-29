Ext.define('PSR.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.psr-ajax',
    config: {
        withAuthToken: false
    },
    limitParam: 'limit',
    startParam: 'offset',
    simpleSortMode: true,
    reader: {
        type: 'json',
        totalProperty: 'totalElements',
        rootProperty: 'content'
    },
    sendRequest: function (request) {
        request.setRawRequest(PSR.data.Ajax.request(request.getCurrentConfig()));
        this.lastRequest = request;
        return request;
    },
    doRequest: function (operation) {
        const proxy = this, withAuthToken = proxy.getWithAuthToken();
        if (withAuthToken) {
            const authHeader = PSR.util.Auth.getAuthorizationHeader(function (authHeader) {
                proxy.doRequest(operation);
            });
            if (!authHeader) {
                return;
            }
            proxy.setHeaders(Object.assign({}, proxy.getHeaders(), authHeader));
        }
        proxy.callParent([operation]);
    }
});
