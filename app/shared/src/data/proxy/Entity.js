Ext.define('PSR.data.proxy.Entity', {
    extend: 'PSR.data.proxy.Ajax',
    alias: 'proxy.entity',
    filterParam: 'filter_options',
    encodeFilters: function (filters) {
        const filterOptions = {};
        for (let i = 0; i < filters.length; i++) {
            const filter = filters[i];
            const filterJson = filter.serialize(),
                property = filterJson.property,
                value = filterJson.value,
                operator = filterJson.operator,
                propertyFilterOptions = filterOptions[property] || [],
                valueRange = {
                    sign: 'EXCLUDED',
                    from: value
                };
            filterOptions[property] = propertyFilterOptions;
            switch (operator) {
                case '==':
                    valueRange.operation = 'NOTEQUAL';
                    break;
                case 'eq':
                    valueRange.operation = 'NOTEQUAL';
                    break;
                case 'like':
                    valueRange.operation = 'NOTLIKE';
                    break;
                case 'in':
                    valueRange.operation = 'NOTIN';
                    delete valueRange.from;
                    valueRange.collect = value;
                    break;
                case 'gt':
                    valueRange.operation = 'LESSTHANOREQUAL';
                    break;
                case 'lt':
                    valueRange.operation = 'GRATERTHANOREQUAL';
                    break;
                case 'isnull':
                    valueRange.operation = 'NOTNULL';
                    delete valueRange.from;
                    break;
                case 'notnull':
                    valueRange.operation = 'ISNULL';
                    delete valueRange.from;
                    break;
                default:
                    PSR.util.Message.error("不支持的过滤操作符:" + operator);
                    continue;
                    break;
            }
            propertyFilterOptions.push(valueRange);
        }
        return Ext.encode(filterOptions);
    }
});
