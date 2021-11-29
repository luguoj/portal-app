Ext.define('PSR.data.file.FileApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/file/api/file';
    },
    download: function (opt) {
        const url = this.getAPIUrl();
        PSR.data.File.download({
            url: url + '/' + opt.id,
            withAuthToken: true,
            disableCaching: true
        });
    }
});
