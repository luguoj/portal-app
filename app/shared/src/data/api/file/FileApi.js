Ext.define('PortalApp.data.api.file.FileApi', {
    singleton: true,
    getAPIUrl: function () {
        return window.portalEnv.gateway + '/file/api/file';
    },
    download: function (opt) {
        const url = this.getAPIUrl();
        PSR.data.File.download({
            url: url + '/' + opt.id,
            withAuthToken: true
        });
    },
    downloadVersion: function (opt) {
        const url = window.portalEnv.gateway + '/file/api/file_version';
        PSR.data.File.download({
            url: url + '/' + opt.id,
            withAuthToken: true
        });
    },
    upload: function (opt) {
        const formData = new FormData();
        formData.append('file', opt.file);
        const dlgprogress = Ext.Msg.show({
            title: '上传中...',
            progress: true,
            closable: false
        });
        const params = {version: opt.version};
        PSR.data.Ajax.request({
            method: 'PUT',
            headers: {
                "Content-Type": null
            },
            url: this.getAPIUrl() + '/' + opt.id,
            withAuthToken: true,
            params: params,
            rawData: formData,
            bizSuccess: function (data) {
                PSR.util.Message.info('上传成功');
                if (opt.success) {
                    opt.success(data);
                }
            },
            complete: function () {
                dlgprogress.close();
            },
            uploadprogress: function (e) {
                if (e.loaded == e.total) {
                    dlgprogress.updateProgress(e.loaded / e.total, e.loaded + ' / ' + e.total + ',保存中...')
                } else {
                    dlgprogress.updateProgress(e.loaded / e.total, e.loaded + ' / ' + e.total)
                }
            }
        });
    },
    patchMeta: function (opt) {
        const params = {version: opt.version};
        if (opt.storageService) {
            params['storage_service'] = opt.storageService;
        }
        if (opt.versionControl) {
            params['version_control'] = opt.versionControl;
        }
        if (opt.abandoned) {
            params['abandoned'] = opt.abandoned;
        }
        PSR.data.Ajax.request({
            method: 'PATCH',
            headers: {
                "Content-Type": null
            },
            url: this.getAPIUrl() + '/' + opt.id + '/meta',
            withAuthToken: true,
            params: params,
            bizSuccess: function (data) {
                PSR.util.Message.info('修改成功');
                if (opt.success) {
                    opt.success(data);
                }
            }
        });
    }
});
