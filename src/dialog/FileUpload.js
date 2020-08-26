Ext.define('PSR.dialog.FileUpload', {
    xtype: 'psr-dialog-fileupload',
    extend: 'Ext.Dialog',
    width: 600,
    layout: 'fit', padding: 0,
    config: {
        navTitle: '',
        fileField: 'file',
        params: {},
        accept: null,
        uploadHandler: null
    },
    updateNavTitle: function (value) {

    },
    constructor: function (config) {
        const me = this,
            navbar = me.createNavbarConfig(config),
            form = {
                xtype: 'formpanel',
                items: [{
                    xtype: 'filefield',
                    placeholder: '选择文件',
                    name: config.fileField ? config.fileField : 'file',
                    required: true,
                    accept: config.accept
                }]
            };
        if (config.params) {
            for (const paramsKey in config.params) {
                form.items.push({xtype: 'hiddenfield', name: paramsKey, value: config.params[paramsKey]});
            }
        }
        config.items = [navbar, form];
        this.callParent([config]);
    },
    createNavbarConfig: function (config) {
        const me = this;
        return {
            xtype: 'psr-toolbar-navigation',
            title: config.navTitle,
            items: [{
                xtype: 'psr-button-save',
                align: 'right',
                handler: function () {
                    me.onSave()
                }
            }],
            goBackHandler: function () {
                me.close();
            }
        };
    },
    onSave: function () {
        const me = this,
            form = me.getAt(1);
        if (!form.validate()) {
            return
        }
        const formData = new FormData(form.element.dom),
            uploadHandler = me.getUploadHandler(),
            dlgprogress = Ext.create({
                xtype: 'dialog',
                closable: false,
                layout: 'vbox',
                items: [{
                    xtype: 'progress'
                }]
            }),
            progress = dlgprogress.getAt(0);
        dlgprogress.show();
        uploadHandler({
            formData: formData,
            success: function (data) {
                Ext.toast("上传成功");
            },
            failure: function () {
                Ext.toast("上传失败")
            },
            complete: function () {
                dlgprogress.close();
                me.unmask();
            },
            uploadprogress: function (e) {
                progress.setValue(e.loaded / e.total);
                progress.setText('上传中: ' + e.loaded + ' / ' + e.total);
                if (e.loaded == e.total) {
                    dlgprogress.hide();
                    me.mask({xtype: 'loadmask', message: '保存中...'});
                }
            }
        });
    }
});