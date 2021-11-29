Ext.define('PSR.toolbar.Paging', {
    extend: 'Ext.toolbar.Paging',
    xtype: 'psr-pagingtoolbar',
    items: [{
        xtype: 'combobox',
        valueField: 'limit',
        displayField: 'limit',
        editable: false,
        queryMode: 'local',
        value: 50,
        store: {
            fields: ['limit'],
            data: [[50], [100], [200], [500], [1000], [2000]]
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
    }]
});