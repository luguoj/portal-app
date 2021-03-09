Ext.define('PSR.grid.column.Toggle', {
    extend: 'Ext.grid.column.Column',
    xtype: 'psr-grid-column-toggle',
    width: 51, maxWidth: 51, minWidth: 51, align: 'center',
    menuDisabled: true,
    config: {
        flagIndex: '',
        toggleHandler: 'toggle',
        disabledBinding: '',
        recordIndex: 'isRecord'
    },
    constructor: function (config) {
        const recordIndex = config.recordIndex || this.config.recordIndex,
            flagIndex = config.flagIndex,
            disabledBinding = config.disabledBinding,
            toggleHandler = config.toggleHandler;
        config.cell = {
            xtype: 'widgetcell',
            widget: {
                xtype: 'button',
                width: 45,
                bind: {
                    tooltip: '{record.' + flagIndex + '?"是":"否"}',
                    iconCls: '{record.' + flagIndex + '?"x-fa fa-check p-confirm-important":"x-fa fa-times p-decline-important"}',
                    hidden: '{!record.' + recordIndex + '}',
                    disabled: '{' + disabledBinding + '}',
                    ui: '{(' + disabledBinding + '?"alt ":"") + (record.' + flagIndex + '?"confirm":"decline")}'
                },
                handler: toggleHandler
            }
        };
        if (config.text) {
            config.minWidth = config.maxWidth = config.width = PSR.util.Grid.getColumnWidth(config.text);
        }
        this.callParent([config]);
    }
});
