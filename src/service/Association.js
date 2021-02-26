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
    },
    saveRightIds: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'POST',
            url: this.getUrlPrefix() + '/saveRightIds',
            params: {leftId: opt.leftId, rightIds: opt.rightIds},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    },
    saveLeftIds: function (opt) {
        PSR.clientSite.Ajax.request({
            method: 'POST',
            url: this.getUrlPrefix() + '/saveLeftIds',
            params: {leftIds: opt.leftIds, rightId: opt.rightId},
            disableCaching: true,
            bizSuccess: opt.success,
            bizFailure: opt.failure,
            complete: opt.complete
        });
    }
});
