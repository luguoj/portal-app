Ext.define('PSR.overrides.Ext.grid.column.Action', {
    override: 'Ext.grid.column.Action',
    resizable: false,
    menuDisabled: true,
    editRenderer: function () {
        return '';
    },
    constructor: function (config) {
        this.callParent([config]);
        this.setWidth(37 + (config.items.length - 1) * 28);
    }
});
