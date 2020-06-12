Ext.define('PSR.dataview.search.Base', {
    extend: 'Ext.Container',
    xtype: 'psr-dataview-search',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        search: function () {
            var v = this.getView(), vm = this.getViewModel(),
                store = v.getStore();
            proxy = store.proxy;
            const params = Object.assign(proxy.getExtraParams(), v.searchView.getValues());
            proxy.setExtraParams(params)
            store.load();
        }
    },
    layout: 'fit',
    config: {
        hideSearchView: true,
        resultView: {
            lazy: true,
            $value: {}
        },
        searchView: {
            lazy: true,
            $value: {}
        }
    },
    applySearchView: function (searchView) {
        if (searchView && !searchView.xtype) {
            return Object.assign({
                xtype: 'formpanel',
                scrollable: 'y'
            }, searchView);
        } else {
            return searchView;
        }
    },
    updateStore: function (store) {
        if (this.resultView) {
            this.resultView.setStore(store);
        }
    },
    updateHideSearchView: function (hide) {
        if (this.searchPanel) {
            if (hide) {
                this.searchPanel.hide();
            } else {
                this.searchPanel.show();
            }
        }
    },
    setSelected: function (selected) {
        this.resultView.getSelectable().select(selected);
    },
    getSelected: function () {
        this.resultView.getSelectable().getSelectedRecords();
    },
    constructor: function (config) {
        this.callParent([config]);
        var me = this;
        this.resultView = this.add(this.createResultView());
        this.resultView.setStore(this.getStore());
        this.resultView.on({
            selectionchange: function (view, records) {
                me.fireEvent('selectionchange', view, records);
            }
        });
        var searchView = this.createSearchView();
        if (searchView) {
            this.searchPanel = this.add({
                xtype: 'panel',
                docked: 'left',
                width: '30%',
                resizable: {split: true, edges: 'east'},
                hidden: !!this.getHideSearchView(),
                layout: 'fit',
                items: [{
                    xtype: 'button',
                    text: '搜索', iconCls: 'x-fa fa-search',
                    docked: 'top',
                    handler: 'search'
                }]
            });
            this.searchView = this.searchPanel.add(searchView);
        }
    },
    // 清单视图
    createResultView: function () {
        return this.getResultView();
    },
    // 搜索视图
    createSearchView: function () {
        return this.getSearchView();
    },
    search: function () {
        this.getController().search();
    }
});
