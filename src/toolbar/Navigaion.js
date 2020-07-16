Ext.define('PSR.toolbar.Navigation', {
    extend: 'Ext.Toolbar',
    xtype: 'psr-toolbar-navigation',
    config: {
        goBackHandler: null
    },
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        if (me.getGoBackHandler()) {
            me.add({
                tooltip: '返回', iconCls: 'x-fa fa-arrow-left',
                handler: me.getGoBackHandler()
            });
        }
    }
});
