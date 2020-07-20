Ext.define('PSR.toolbar.CRUDList', {
    extend: 'Ext.Toolbar',
    xtype: 'psr-toolbar-crudlist',
    config: {
        selection: null,
        detailsHandler: null,
        createHandler: null,
        cloneHandler: null,
        deleteHandler: null,
    },
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        if (me.getDetailsHandler()) {
            me.btnDetails = me.add({
                tooltip: '明细', iconCls: 'x-fa fa-file-alt',
                disabled: !this.getSelection(),
                handler: function (button) {
                    Ext.callback(me.getDetailsHandler(), button.getScope(), [me.getSelection()], 0, button);
                }
            });
        }
        if (me.getCreateHandler()) {
            me.add({
                tooltip: '创建', iconCls: 'x-fa fa-file-medical',
                handler: me.getCreateHandler()
            });
        }
        if (me.getCloneHandler()) {
            me.btnClone = me.add({
                tooltip: '克隆', iconCls: 'x-fa fa-copy',
                disabled: !this.getSelection(),
                handler: function (button) {
                    var selection = me.getSelection();
                    Ext.Msg.confirm("确认克隆",
                        "克隆对象:" + selection.data.text,
                        function (buttonId) {
                            if (buttonId == 'yes') {
                                Ext.callback(me.getCloneHandler(), button.getScope(), [selection], 0, button);
                            }
                        });
                }
            });
        }
        if (me.getDeleteHandler()) {
            me.btnDelete = me.add({
                tooltip: '删除', iconCls: 'x-fa fa-file-excel',
                disabled: !this.getSelection(),
                handler: function (button) {
                    var selection = me.getSelection();
                    Ext.Msg.confirm("确认删除",
                        "删除对象:" + selection.data.text,
                        function (buttonId) {
                            if (buttonId == 'yes') {
                                Ext.callback(me.getDeleteHandler(), button.getScope(), [selection], 0, button);
                            }
                        });
                }
            });
        }
    },
    updateSelection: function (value) {
        if (this.btnDetails) {
            this.btnDetails.setDisabled(!value);
        }
        if (this.btnClone) {
            this.btnClone.setDisabled(!value);
        }
        if (this.btnDelete) {
            this.btnDelete.setDisabled(!value);
        }
    }
});
