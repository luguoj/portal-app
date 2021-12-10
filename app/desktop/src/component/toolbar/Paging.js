Ext.define('PSR.toolbar.Paging', {
    extend: 'Ext.toolbar.Paging',
    xtype: 'psr-pagingtoolbar',
    items: [{
        xtype: 'combobox',
        valueField: 'limit',
        displayField: 'limit',
        editable: false,
        queryMode: 'local',
        store: {
            fields: ['limit'],
            data: [[10], [20], [50], [100], [200], [500], [1000], [2000]]
        },
        listeners: {
            change: function (combo, newValue) {
                const store = combo.up('psr-pagingtoolbar').getStore();
                store.setPageSize(newValue);
                if (store.isLoaded()) {
                    store.loadPage(1);
                }
            }
        }
    }],
    initComponent: function () {
        this.callParent();
        const store = this.getStore(),
            comboLimit = this.comboLimit = this.down('combobox[valueField=limit]');
        if (store) {
            comboLimit.setValue(store.getPageSize());
        }
    },
    onBindStore: function (store, initial) {
        this.callParent([store, initial]);
        if (this.comboLimit) {
            this.comboLimit.setValue(store.getPageSize());
        }
    },
});