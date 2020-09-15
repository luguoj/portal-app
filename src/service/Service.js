Ext.define('PSR.service.Service', {
    config: {
        getContextPath: function () {
            return '';
        },
        getApiPath: function () {
            return '';
        }
    },
    getUrlPrefix: function () {
        return window.gatewaySite + this.getContextPath() + this.getApiPath();
    }
});
