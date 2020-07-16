Ext.define('PSR.grid.plugin.CRUD', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.psr-grid-crud',
    config: {
        grid: null,
        detailsHandler: null,
        createHandler: null,
        cloneHandler: null,
        deleteHandler: null,
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
        toolbars.push(me.searchToolbar = tbContainer.add(me.createSearchToolbar()));
        tbContainer.add({xtype: 'container', width: 1});
        toolbars.push(me.actionToolbar = tbContainer.add(me.createActionToolbar()));
        var extraActionToolbarsCfg = me.getActionToolbars();
        if (extraActionToolbarsCfg && extraActionToolbarsCfg.length > 0) {
            for (let i = 0; i < extraActionToolbarsCfg.length; i++) {
                tbContainer.add({xtype: 'container', width: 1});
                toolbars.push(tbContainer.add(extraActionToolbarsCfg[i]));
            }
        }
        tbContainer.add({xtype: 'container', width: 1});
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
            enableSearchFilter: true,
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
    createActionToolbar: function () {
        var me = this,
            cfg;
        cfg = {
            xtype: 'psr-toolbar-crudlist',
            detailsHandler: me.getDetailsHandler(),
            createHandler: me.getCreateHandler(),
            cloneHandler: me.getCloneHandler(),
            deleteHandler: me.getDeleteHandler()
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
                selectionchange: 'onSelectionChanged',
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
    onSelectionChanged: function (grid) {
        var selection = grid.getSelection(),
            actionToolbar = this.actionToolbar,
            btnClone = actionToolbar.getAt(1),
            btnDelete = actionToolbar.getAt(2);
        this.selection = selection;
        actionToolbar.setSelection(selection);
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
