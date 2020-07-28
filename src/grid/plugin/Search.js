Ext.define('PSR.grid.plugin.Search', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.psr-grid-search',
    config: {
        grid: null,
        actionToolbars: [],
        searchFilter: {
            xtype: 'formpanel',
            docked: 'left', width: '20%', resizable: {split: true, edges: 'east'}, scrollable: 'y',
            hidden: true
        }
    },
    init: function (grid) {
        var me = this,
            toolbars = [];
        me.setGrid(grid);
        me.toolbars = toolbars;
        var tbContainer = grid.add({
            xtype: 'toolbar',
            docked: 'top', padding: 0, layout: {type: 'hbox', wrap: true},
        });
        var actionToolbars = me.getActionToolbars();
        if (actionToolbars && actionToolbars.length > 0) {
            for (let i = 0; i < actionToolbars.length; i++) {
                if (actionToolbars[i].tbalign === 'left') {
                    toolbars.push(tbContainer.add(actionToolbars[i]));
                    tbContainer.add({xtype: 'container', width: 1});
                }
            }
        }
        toolbars.push(me.searchToolbar = tbContainer.add(me.createSearchToolbar()));
        tbContainer.add({xtype: 'container', width: 1});
        if (actionToolbars && actionToolbars.length > 0) {
            for (let i = 0; i < actionToolbars.length; i++) {
                if (actionToolbars[i].tbalign !== 'left') {
                    toolbars.push(tbContainer.add(actionToolbars[i]));
                    tbContainer.add({xtype: 'container', width: 1});
                }
            }
        }
        tbContainer.add({xtype: 'toolbar', flex: 1});
        me.setSearchFilter(grid.add(me.getSearchFilter()));
    },
    destroy: function () {
        this.setGrid(null);
        this.callParent();
    },
    createSearchToolbar: function () {
        var me = this,
            cfg;
        cfg = {
            xtype: 'psr-toolbar-search',
            searchHandler: function () {
                me.onSearch();
            },
            listeners: {
                searchFilterShowedchange: function (toolbar, newValue) {
                    me.onSearchFilterShowedChange(newValue);
                }
            }
        };
        return cfg;
    },
    updateGrid: function (grid, oldGrid) {
        var me = this;
        me.gridListeners = me.storeListeners = Ext.destroy(
            me.gridListeners, me.storeListeners
        );
        if (grid) {
            me.gridListeners = grid.on({
                storechange: 'onStoreChanged',
                destroyable: true,
                scope: me
            });
            me.bindStore(grid.getStore());
        }
    },
    bindStore: function (store) {
        var me = this;
        Ext.destroy(me.storeListeners);
        if (!store) {
            return;
        }
        me.storeListeners = store.on({
            beforeload: 'beforeStoreLoad',
            load: 'onStoreLoaded',
            destroyable: true,
            scope: me
        });
        if (store.isLoading()) {
            me.beforeStoreLoad();
        }
    },
    onStoreChanged: function (grid, store) {
        this.bindStore(store);
    },
    beforeStoreLoad: function () {
    },
    onStoreLoaded: function () {
    },
    onSearch: function () {
        var grid = this.getGrid(),
            store = grid.getStore(),
            proxy = store.getProxy(),
            searchFilter = this.getSearchFilter(),
            params;
        if (searchFilter) {
            params = Object.assign(proxy.getExtraParams(), searchFilter.getValues());
            proxy.setExtraParams(params);
        }
        store.load();
    },
    onSearchFilterShowedChange: function (newValue) {
        this.getSearchFilter().setHidden(!newValue);
    }
});
