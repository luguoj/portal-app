Ext.define('PSR.toolbar.CRUDList', {
    extend: 'Ext.Toolbar',
    xtype: 'psr-toolbar-crudlist',
    config: {
        selection: null,
        detailsHandler: null,
        createHandler: null,
        cloneHandler: null,
        deleteHandler: null,
        displayField: 'displaytext'
    },
    constructor: function (config) {
        const me = this;
        me.callParent([config]);
        me.btnDetails = me.add({
            text: '明细', iconCls: 'x-fa fa-file-alt',
            disabled: !this.getSelection(),
            hidden: !me.getDetailsHandler(),
            handler: function (button) {
                Ext.callback(me.getDetailsHandler(), button.getScope(), [me.getSelection()], 0, button);
            }
        });
        me.btnCreate = me.add({
            text: '创建', iconCls: 'x-fa fa-file-medical',
            hidden: !me.getCreateHandler(),
            handler: function (button) {
                Ext.callback(me.getCreateHandler(), button.getScope(), [me.getSelection()], 0, button);
            }
        });
        me.btnClone = me.add({
            text: '克隆', iconCls: 'x-fa fa-copy',
            hidden: !me.getCloneHandler(),
            disabled: !this.getSelection(),
            handler: function (button) {
                var selection = me.getSelection();
                Ext.Msg.confirm("确认克隆",
                    "克隆对象:" + selection.get(me.getDisplayField()),
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            Ext.callback(me.getCloneHandler(), button.getScope(), [selection], 0, button);
                        }
                    });
            }
        });
        me.btnDelete = me.add({
            text: '删除', iconCls: 'x-fa fa-file-excel',
            hidden: !me.getDeleteHandler(),
            disabled: !this.getSelection(),
            handler: function (button) {
                var selection = me.getSelection();
                Ext.Msg.confirm("确认删除",
                    "删除对象:" + selection.get(me.getDisplayField()),
                    function (buttonId) {
                        if (buttonId == 'yes') {
                            Ext.callback(me.getDeleteHandler(), button.getScope(), [selection], 0, button);
                        }
                    });
            }
        });
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
    },
    updateDetailsHandler: function (handler) {
        if (this.btnDetails) {
            this.btnDetails.setHidden(!handler);
        }
    },
    updateCreateHandler: function (handler) {
        if (this.btnCreate) {
            this.btnCreate.setHidden(!handler);
        }
    },
    updateCloneHandler: function (handler) {
        if (this.btnClone) {
            this.btnClone.setHidden(!handler);
        }
    },
    updateDeleteHandler: function (handler) {
        if (this.btnDelete) {
            this.btnDelete.setHidden(!handler);
        }
    },
});
