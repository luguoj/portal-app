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
            notEqual: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'NOTEQUAL',
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
            notLike: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'NOTLIKE',
                    from: from
                };
            },
            graterThan: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'GRATERTHAN',
                    from: from
                };
            },
            graterThanOrEqual: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'GRATERTHANOREQUAL',
                    from: from
                };
            },
            lessThan: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'LESSTHAN',
                    from: from
                };
            },
            lessThanOrEqual: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'LESSTHANOREQUAL',
                    from: from
                };
            },
            between: function (from, to) {
                return {
                    sign: 'INCLUDED',
                    operation: 'BETWEEN',
                    from: from,
                    to: to
                };
            },
            notBetween: function (from, to) {
                return {
                    sign: 'INCLUDED',
                    operation: 'NOTBETWEEN',
                    from: from,
                    to: to
                };
            },
            isNull: function () {
                return {
                    sign: 'INCLUDED',
                    operation: 'ISNULL'
                };
            },
            notNull: function () {
                return {
                    sign: 'INCLUDED',
                    operation: 'NOTNULL'
                };
            },
            in: function (collect) {
                return {
                    sign: 'INCLUDED',
                    operation: 'IN',
                    collect: collect
                };
            },
            notIn: function (collect) {
                return {
                    sign: 'INCLUDED',
                    operation: 'NOTIN',
                    collect: collect
                };
            },
            contain: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'LIKE',
                    from: '%' + from + '%'
                };
            },
            beginWith: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'LIKE',
                    from: from + '%'
                };
            },
            endWith: function (from) {
                return {
                    sign: 'INCLUDED',
                    operation: 'LIKE',
                    from: '%' + from
                };
            }
        },
        excluded: {
            equal: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'EQUAL',
                    from: from
                };
            },
            notEqual: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'NOTEQUAL',
                    from: from
                };
            },
            like: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'LIKE',
                    from: from
                };
            },
            notLike: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'NOTLIKE',
                    from: from
                };
            },
            graterThan: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'GRATERTHAN',
                    from: from
                };
            },
            graterThanOrEqual: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'GRATERTHANOREQUAL',
                    from: from
                };
            },
            lessThan: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'LESSTHAN',
                    from: from
                };
            },
            lessThanOrEqual: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'LESSTHANOREQUAL',
                    from: from
                };
            },
            between: function (from, to) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'BETWEEN',
                    from: from,
                    to: to
                };
            },
            notBetween: function (from, to) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'NOTBETWEEN',
                    from: from,
                    to: to
                };
            },
            isNull: function () {
                return {
                    sign: 'EXCLUDED',
                    operation: 'ISNULL'
                };
            },
            notNull: function () {
                return {
                    sign: 'EXCLUDED',
                    operation: 'NOTNULL'
                };
            },
            in: function (collect) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'IN',
                    collect: collect
                };
            },
            notIn: function (collect) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'NOTIN',
                    collect: collect
                };
            },
            contain: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'LIKE',
                    from: '%' + from + '%'
                };
            },
            beginWith: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'LIKE',
                    from: from + '%'
                };
            },
            endWith: function (from) {
                return {
                    sign: 'EXCLUDED',
                    operation: 'LIKE',
                    from: '%' + from
                };
            }
        }
    }
});
