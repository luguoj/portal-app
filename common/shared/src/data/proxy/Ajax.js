Ext.define('PSR.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.psr-ajax',
    limitParam: 'limit',
    startParam: 'offset',
    simpleSortMode: true,
    reader: {
        type: 'json',
        totalProperty: 'totalElements',
        rootProperty: 'content'
    }
});
