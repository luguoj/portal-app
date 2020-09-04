Ext.define('PSR.util.Store', {
    singleton: true,
    filter: function (text, property, store) {
        if (text && text.length > 0) {
            store.getFilters().replaceAll({
                property: property,
                value: new RegExp(Ext.String.escapeRegex(text), 'i')
            });
        } else {
            store.clearFilter();
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
