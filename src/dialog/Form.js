Ext.define('PSR.dialog.Form', {
    xtype: 'psr-dialog-form',
    extend: 'Ext.Dialog',
    width: 600,
    layout: 'fit', padding: 0,
    config: {
        navTitle: '',
        params: {},
        formFields: [],
        handler: null
    },
    updateNavTitle: function (value) {

    },
    constructor: function (config) {
        const me = this,
            navbar = {
                xtype: 'psr-toolbar-navigation',
                title: config.navTitle || this.config.navTitle,
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
            },
            form = {
                xtype: 'formpanel',
                items: [].concat(config.formFields || this.config.formFields || [])
            };
        if (config.params) {
            for (var paramsKey in config.params) {
                form.items.push({xtype: 'hiddenfield', name: paramsKey, value: config.params[paramsKey]});
            }
        }
        config.items = [navbar, form];
        this.callParent([config]);
    },
    onSave: function () {
        const me = this,
            form = me.getAt(1);
        if (!form.validate()) {
            return
        }
        const values = form.getValues(),
            formData = new FormData(form.element.dom),
            handler = me.getHandler(),
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
        for (const valuesKey in values) {
            if (!formData.get(valuesKey)) {
                formData.set(valuesKey, values[valuesKey]);
            }
        }
        handler({
            formData: formData,
            success: function (data) {
                Ext.toast("上传成功");
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
