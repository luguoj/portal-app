Ext.define('PSR.grid.column.Toggle', {
    extend: 'Ext.grid.column.Column',
    xtype: 'psr-grid-column-toggle',
    width: 51, maxWidth: 51, minWidth: 51, align: 'center',
    menuDisabled: true,
    config: {
        flagIndex: '',
        toggleHandler: 'toggle',
        disabledBinding: ''
    },
    constructor: function (config) {
        const flagIndex = config.flagIndex,
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
                    hidden: '{!record.isRecord}',
                    disabled: '{' + disabledBinding + '}',
                    ui: '{(' + disabledBinding + '?"alt ":"") + (record.' + flagIndex + '?"confirm":"decline")}'
                },
                handler: toggleHandler
            }
        };
        this.callParent([config]);
    }
});
