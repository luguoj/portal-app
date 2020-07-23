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
                tooltip: '返回', iconCls: 'x-fa fa-arrow-left',
                align: 'left',
                handler: me.getGoBackHandler()
            });
        }
    }
});
