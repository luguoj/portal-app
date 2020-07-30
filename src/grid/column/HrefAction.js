Ext.define('PSR.grid.column.HrefAction', {
    extend: 'Ext.grid.column.Text',
    xtype: 'psr-grid-column-hrefaction',
    config: {
        action: null,
    },
    align: 'center',
    menuDisabled: true, sortable: false,
    updateWidth: function (width) {
        this.setMaxWidth(width);
        this.setMinWidth(width);
    },
    constructor: function (config) {
        this.config.cell = {
            xtype: 'psr-grid-cell-href',
            renderer: function (value, record) {
                return !record.data.isPath ? config.text : '';
            },
            handler: config.action
        };
        config.width = PSR.Util.getGridCellTextWidth(config.text) + 26;
        this.callParent([config]);
    }
});
