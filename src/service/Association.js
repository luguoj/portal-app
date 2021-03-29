Ext.define('PSR.service.Association', {
    extend: 'PSR.service.Entity',
    searchByLeftId: function (opt) {
        opt.searchParams = opt.searchParams || {};
        opt.searchParams.leftId = [{
            sign: 'INCLUDED',
            operation: 'EQUAL',
            from: opt.leftId
        }];
        this.search(opt);
    },
    searchByRightId: function (opt) {
        opt.searchParams = opt.searchParams || {};
        opt.searchParams.rightId = [{
            sign: 'INCLUDED',
            operation: 'EQUAL',
            from: opt.rightId
        }];
        this.search(opt);
    }
});
