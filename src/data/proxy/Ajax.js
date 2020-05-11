Ext.define('PSR.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.psr-ajax',
    limitParam: 'pageSize',
    reader: {
        type: 'json',
        totalProperty: 'totalCount',
        rootProperty: 'result'
    }
});
