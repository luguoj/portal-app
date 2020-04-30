Ext.define('PSR.mixin.Storable', {
    mixinId: 'storable',
    config: {
        store: null
    },
    applyStore: function (store) {
        var me = this;
        store = store ? Ext.data.StoreManager.lookup(store) : null;
        if (store) {
            store.on({
                beforeload: function (store, operation) {
                    if (me.mask) {
                        me.mask({xtype: 'loadmask', message: '加载中...'});
                    }
                    me.onStoreBeforeLoad(store, operation);
                },
                load: function (store, records, success) {
                    me.onStoreLoad(store, records, success);
                    if (me.unmask) {
                        me.unmask();
                    }
                }
            })
        }
        return store;
    },
    onStoreBeforeLoad: function (store, operation) {

    },
    onStoreLoad: function (store, records, success) {

    }
});
