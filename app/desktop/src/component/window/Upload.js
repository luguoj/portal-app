Ext.define('PSR.window.Upload', {
    xtype: 'psr-uploadwindow',
    extend: 'Ext.window.Window',
    width: '50%',
    modal: true,
    title: '上传文件',
    layout: 'fit',
    config: {
        accept: null,
        multiple: false,
        uploadHandler: null
    },
    items: [{
        xtype: 'form',
        padding: 10,
        items: [],
        buttons: [{
            text: '确认', handler: function (btn) {
                btn.up('psr-uploadwindow').confirm();
            }
        }]
    }],
    afterRender: function () {
        this.callParent();
        const form = this.down('form'),
            accept = this.getAccept(),
            multiple = this.getMultiple();
        form.add({
            xtype: 'filefield',
            fieldLabel: '选择文件',
            emptyText: '选择文件',
            anchor: '100%',
            allowBlank: false,
            accept: accept,
            multiple: multiple
        });
    },
    confirm: function () {
        const me = this,
            uploadHandler = me.getUploadHandler(),
            form = me.down('form'),
            filefield = form.down('filefield');
        if (filefield.fileInputEl.dom.files.length == 0) {
            PSR.util.Message.info("请选择文件");
            return
        }
        uploadHandler(filefield.fileInputEl.dom.files[0]);
    }
});
