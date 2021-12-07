Ext.define('PSR.data.api.file.FileApi', {
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
    },
    patch: function (opt) {
        const formData = new FormData();
        if (opt.file) {
            formData.append('file', opt.file);
            opt.dlgprogress = Ext.Msg.show({
                title: '上传中...',
                progress: true,
                closable: false
            });
        }
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
                if (opt.dlgprogress) {
                    opt.dlgprogress.close();
                    delete opt.dlgprogress;
                }
            },
            uploadprogress: function (e) {
                if (opt.dlgprogress) {
                    if (e.loaded == e.total) {
                        opt.dlgprogress.updateProgress(e.loaded / e.total, e.loaded + ' / ' + e.total + ',保存中...')
                    } else {
                        opt.dlgprogress.updateProgress(e.loaded / e.total, e.loaded + ' / ' + e.total)
                    }
                }
            }
        });
    }
});
