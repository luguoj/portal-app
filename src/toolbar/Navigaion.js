Ext.define('PSR.toolbar.Navigation', {
    extend: 'Ext.TitleBar',
    xtype: 'psr-toolbar-navigation',
    config: {
        goBackHandler: null
    },
    docked: 'top',
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        if (me.getGoBackHandler()) {
            me.add({
                xtype: 'psr-button-goback',
                align: 'left',
                handler: me.getGoBackHandler()
            });
        }
    }
});
