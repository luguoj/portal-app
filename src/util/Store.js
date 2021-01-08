Ext.define('PSR.util.Store', {
    singleton: true,
    filterText: function (text, property, store) {
        if (text && text.length > 0) {
            store.getFilters().add({
                property: property,
                value: new RegExp(Ext.String.escapeRegex(text), 'i')
            });
        } else {
            store.getFilters().removeByKey(property)
        }
    },
    includeTextFilter: function (property, text) {
        return {
            property: property,
            value: new RegExp(Ext.String.escapeRegex(text), 'i')
        };
    },
    filter: function (store, filters) {
        if (filters) {
            store.getFilters().replaceAll(filters);
        } else {
            store.clearFilter();
        }
    }
});
