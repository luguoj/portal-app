Ext.define('PSR.util.service.Entity', {
    singleton: true,
    searchParams: {
        include: {
            equal: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'EQUAL',
                    from: from
                };
            },
            like: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'LIKE',
                    from: from
                };
            },
            in: function (collect) {
                return {
                    sign: 'INCLUDED',
                    operation: 'IN',
                    collect: collect
                };
            }
        }
    }
});
