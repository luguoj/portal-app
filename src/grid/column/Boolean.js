Ext.define('PSR.grid.column.Boolean', {
    extend: 'Ext.grid.column.Boolean',
    xtype: 'psr-grid-column-boolean',
    width: 51, maxWidth: 51, minWidth: 51, align: 'center',
    trueText: '<div class="x-fa fa-check p-confirm"/>', falseText: '<div class="x-fa fa-times p-decline"/>',
    menuDisabled: true,
    cell: {encodeHtml: false}
});
