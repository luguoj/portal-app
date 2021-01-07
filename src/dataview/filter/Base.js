Ext.define('PSR.dataview.filter.Base', {
    extend: 'Ext.Container',
    xtype: 'psr-dataview-filter',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        search: function () {
            var v = this.getView(), vm = this.getViewModel(),
                store = v.getStore();
            store.load();
        },
        doFilter: function (field, value) {
            var me = this,
                v = this.getView(),
                vm = this.getViewModel(),
                store = v.getStore();
            PSR.util.Store.filter(value, v.getFilterProperty(), store);
        }
    },
    layout: 'fit',
    items: [{
        xtype: 'toolbar', docked: 'top',
        items: [{
            xtype: 'searchfield', flex: 1, placeholder: '查找',
            listeners: {
                buffer: 300,
                change: 'doFilter'
            },
        }]
    }],
    config: {
        filterProperty: 'text',
        resultView: {
            lazy: true,
            $value: {}
        }
    },
    updateStore: function (store) {
        if (this.resultView) {
            this.resultView.setStore(store);
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
    },
    // 清单视图
    createResultView: function () {
        return this.getResultView();
    },
    search: function () {
        this.getController().search();
    }
});
