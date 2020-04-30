Ext.define('PSR.grid.column.TreeHref', {
    extend: 'Ext.grid.column.Tree',
    xtype: 'psr-grid-column-treehref',
    config: {
        cell: {
            xtype: 'psr-grid-cell-treehref'
        }
    }
});
