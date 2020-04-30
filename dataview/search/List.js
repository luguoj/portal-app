Ext.define('PSR.dataview.search.List', {
    extend: 'PSR.dataview.search.Base',
    xtype: 'psr-dataview-search-list',
    resultView: {
        xtype: 'grid',
        plugins: {gridpagingtoolbar: true},
        columns: [{
            text: 'Name',
            dataIndex: 'text',
            minWidth: 100,
            flex: 1
        }]
    }
});
