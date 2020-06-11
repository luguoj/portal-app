Ext.define('PSR.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.psr-ajax',
    limitParam: 'pageSize',
    simpleSortMode: true,
    reader: {
        type: 'json',
        totalProperty: 'totalCount',
        rootProperty: 'result'
    }
});
