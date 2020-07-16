Ext.define('PSR.toolbar.Search', {
    extend: 'Ext.Toolbar',
    xtype: 'psr-toolbar-search',
    config: {
        enableSearchFilter: true,
        searchHandler: null,
    },
    eventedConfig: {
        searchFilterShowed: false
    },
    publishes: {
        searchFilterShowed: true
    },
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        if (me.getEnableSearchFilter()) {
            me.add({
                tooltip: '过滤器', iconCls: 'x-fa fa-filter',
                enableToggle: true,
                toggleHandler: function (button, value) {
                    me.setSearchFilterShowed(value);
                }
            });
        }
        if (me.getSearchHandler()) {
            me.add({
                tooltip: '搜索', iconCls: 'x-fa fa-search',
                handler: me.getSearchHandler()
            });
        }
    }
});
