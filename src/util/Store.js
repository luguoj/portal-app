Ext.define('PSR.util.Store', {
    singleton: true,
    filterValue: function (store, property, value) {
        if (value != null) {
            store.getFilters().add({
                property: property,
                value: value
            });
        } else {
            store.getFilters().removeByKey(property)
        }
    },
    filterText: function (store, property, text) {
        if (text && text.length > 0) {
            PSR.util.Store.filterValue(store, property, new RegExp(Ext.String.escapeRegex(text), 'i'));
        } else {
            PSR.util.Store.filterValue(store, property);
        }
    },
    filterRecord: function (store, displayAll) {
        const isRecordProperty = 'isRecord';
        if (displayAll) {
            store.getFilters().removeByKey(isRecordProperty)
        } else {
            store.getFilters().add({
                property: isRecordProperty,
                value: true
            });
        }
    },
    filter: function (store, filters) {
        if (filters) {
            store.getFilters().replaceAll(filters);
        } else {
            store.clearFilter();
        }
    }
});
