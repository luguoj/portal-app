Ext.define('PSR.dataview.Picture', {
    xtype: 'psr-dataview-picture',
    extend: 'Ext.Container',
    mixins: ['PSR.mixin.Storable'],
    layout: 'vbox',
    scrollable: 'y',
    config: {
        upload: true,
        uploadField: 'file',
        dataIndex: 'src',
        itemConfig: {width: 100, height: 100, padding: 5},
        params: {},
        accept: 'image/*',
        uploadHandler: null
    },
    itemContainer: null,
    picItems: [],
    constructor: function (config) {
        const me = this;
        me.callParent([config]);
        const itemConfig = me.getItemConfig();
        me.itemContainer = me.add({
            xtype: 'container',
            layout: {
                type: 'hbox',
                wrap: true,
                pack: 'start'
            },
            defaults: {
                xtype: 'container', width: itemConfig.width, height: itemConfig.height,
                layout: 'fit', padding: itemConfig.padding,
                items: [{
                    xtype: 'panel', border: true, layout: 'fit',
                    items: [{xtype: 'image'}]
                }]
            }
        });
        me.btnUpload = me.itemContainer.add({
            xtype: 'container', width: itemConfig.width, height: itemConfig.height,
            layout: 'fit', padding: itemConfig.padding,
            items: [{
                xtype: 'panel', border: true, layout: 'fit',
                items: [{
                    xtype: 'filebutton',
                    iconCls: 'x-fa fa-plus',
                    text: '',
                    ui: '',
                    accept: me.getAccept(),
                    hidden: !me.getUpload(),
                    capture: 'camera',
                    listeners: {
                        change: function (button, value) {
                            const files = button.getFiles();
                            me.onSave(files);
                            button.buttonElement.dom.value = '';
                            button.setValue('');
                        }
                    }
                }]
            }]
        }).down('filebutton');
        const store = me.getStore();
        if (store && store.isLoaded()) {
            me.createItems();
        }
    },
    updateUpload: function (value) {
        if (this.btnUpload) {
            this.btnUpload.setHidden(!value);
        }
    },
    onStoreLoad: function (store, records, success) {
        if (this.itemContainer) {
            this.createItems();
        }
    },
    createItems: function () {
        const itemContainer = this.itemContainer,
            picItems = this.picItems,
            records = this.getStore().getData().items,
            dataIndex = this.getDataIndex();
        itemContainer.remove(picItems);
        picItems.length = 0;
        if (records && records.length > 0) {
            for (let i = 0; i < records.length; i++) {
                const item = itemContainer.add({});
                item.down('image').setSrc(records[i].get(dataIndex));
                picItems[i] = item;
            }
        }
    },
    onSave: function (files) {
        const me = this,
            params = me.getParams(),
            uploadField = me.getUploadField(),
            store = this.getStore();
        if (!files || files.length <= 0) {
            return
        }
        const formData = new FormData(),
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
        for (let i = 0; i < files.length; i++) {
            formData.append(uploadField, files[i]);
        }
        if (params) {
            for (var paramsKey in params) {
                formData.append(paramsKey, params[paramsKey]);
            }
        }
        uploadHandler({
            formData: formData,
            success: function (data) {
                Ext.toast("上传成功");
                store.load();
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
