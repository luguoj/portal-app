Ext.define('PSR.dataview.filter.List', {
    extend: 'PSR.dataview.filter.Base',
    xtype: 'psr-dataview-filter-list',
    resultView: {
        xtype: 'grid',
        columns: [{
            text: 'Name',
            dataIndex: 'text',
            minWidth: 100,
            flex: 1
        }]
    }
});
