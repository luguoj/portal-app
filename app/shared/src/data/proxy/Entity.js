Ext.define('PSR.data.proxy.Entity', {
    extend: 'PSR.data.proxy.Ajax',
    alias: 'proxy.psr-entity',
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
                    sign: 'INCLUDED',
                    from: value
                };
            filterOptions[property] = propertyFilterOptions;
            switch (operator) {
                case '==':
                    valueRange.operation = 'EQUAL';
                    break;
                case 'eq':
                    valueRange.operation = 'EQUAL';
                    break;
                case 'like':
                    valueRange.operation = 'LIKE';
                    break;
                case 'in':
                    valueRange.operation = 'IN';
                    delete valueRange.from;
                    valueRange.collect = value;
                    break;
                case 'gt':
                    valueRange.sign = 'EXCLUDED';
                    valueRange.operation = 'LESSTHANOREQUAL';
                    break;
                case 'lt':
                    valueRange.sign = 'EXCLUDED';
                    valueRange.operation = 'GRATERTHANOREQUAL';
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
