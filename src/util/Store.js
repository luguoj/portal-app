Ext.define('PSR.util.Store', {
    singleton: true,
    filter: function (text, property, store) {
        if (text && text.length > 0) {
            store.getFilters().replaceAll({
                property: property,
                value: new RegExp(Ext.String.escapeRegex(value), 'i')
            });
        } else {
            store.clearFilter();
        }
    }
});
