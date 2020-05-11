Ext.define('common.patch.Ext.data.request.Ajax', {
    override: 'Ext.data.request.Ajax',
    newRequest: function (options) {
        var xhr = this.callParent([options]);
        if (options.uploadprogress) {
            xhr.upload.onprogress = options.uploadprogress;
        }
        return xhr;
    }
});
