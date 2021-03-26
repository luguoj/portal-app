Ext.define('PSR.grid.column.HrefAction', {
    extend: 'Ext.grid.column.Text',
    xtype: 'psr-grid-column-hrefaction',
    config: {
        action: null,
        isRecordProperty: 'isRecord'
    },
    align: 'center',
    menuDisabled: true, sortable: false,
    updateWidth: function (width) {
        this.setMaxWidth(width);
        this.setMinWidth(width);
    },
    constructor: function (config) {
        const isRecordProperty = config.isRecordProperty || this.config.isRecordProperty;
        this.config.cell = {
            xtype: 'psr-grid-cell-href',
            renderer: function (value, record) {
                return record.data[isRecordProperty] ? config.text : '';
            },
            handler: config.action
        };
        config.width = PSR.util.Grid.getColumnWidth(config.text);
        this.callParent([config]);
    }
});
