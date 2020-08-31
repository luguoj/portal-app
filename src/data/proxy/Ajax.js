Ext.define('PSR.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.psr-ajax',
    limitParam: 'pageSize',
    simpleSortMode: true,
    reader: {
        type: 'json',
        totalProperty: 'totalCount',
        rootProperty: 'result'
    },
    sendRequest: function (request) {
        request.setRawRequest(PSR.Ajax.request(request.getCurrentConfig()));
        this.lastRequest = request;
        return request;
    }
});
