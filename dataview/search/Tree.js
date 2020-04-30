Ext.define('PSR.dataview.search.Tree', {
    extend: 'PSR.dataview.search.Base',
    xtype: 'psr-dataview-search-tree',
    resultView: {
        xtype: 'tree',
        rootVisible: false,
        columns: [{
            xtype: 'treecolumn',
            text: 'Name',
            dataIndex: 'text',
            minWidth: 100,
            flex: 1
        }]
    }
});
