Ext.define('PSR.dataview.filter.Tree', {
    extend: 'PSR.dataview.filter.Base',
    xtype: 'psr-dataview-filter-tree',
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
