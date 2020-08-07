Ext.define('PSR.toolbar.Search', {
    extend: 'Ext.Toolbar',
    xtype: 'psr-toolbar-search',
    config: {
        searchHandler: null,
        refreshHandler: null,
        filterHandler: null
    },
    eventedConfig: {
        searchFilterShowed: false,
        filterText: '',
    },
    publishes: {
        searchFilterShowed: true,
        filterText: true
    },
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        if (me.getSearchHandler()) {
            me.add({
                tooltip: '过滤器', iconCls: 'x-fa fa-filter',
                enableToggle: true,
                toggleHandler: function (button, value) {
                    me.setSearchFilterShowed(value);
                }
            });
            me.add({
                tooltip: '搜索', iconCls: 'x-fa fa-search',
                handler: me.getSearchHandler()
            });
        }
        if (me.getRefreshHandler()) {
            me.add({
                tooltip: '刷新', iconCls: 'x-fa fa-sync',
                handler: me.getRefreshHandler()
            });
        }
        if (me.getFilterHandler()) {
            me.add({
                xtype: 'searchfield',
                placeholder: '搜索',
                value: me.getFilterText(),
                listeners: {
                    buffer: 300,
                    change: function (field, text) {
                        me.setFilterText(text);
                        Ext.callback(me.getFilterHandler(), field.getDefaultListenerScope(), [field, text], 0, field);
                    }
                }
            });
        }
    }
});
