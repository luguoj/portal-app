Ext.define('PSR.toolbar.Editor', {
    extend: 'Ext.Toolbar',
    xtype: 'psr-toolbar-editor',
    config: {
        editable: true,
        resetHandler: null,
        createHandler: null,
        updateHandler: null
    },
    eventedConfig: {
        editing: true,
        creating: true
    },
    publishes: {editing: true, creating: true},
    constructor: function (config) {
        var me = this;
        me.callParent([config]);
        me.btnReset = me.add({
            text: '重置', iconCls: 'x-fa fa-undo'
        });
        me.btnModify = me.add({
            text: '修改', iconCls: 'x-fa fa-edit',
            enableToggle: true,
            toggleHandler: function (button, pressed) {
                if (pressed) {
                    me.toggleEditing();
                } else {
                    me.toggleViewing();
                }
            }
        });
        me.btnUpdate = me.add({
            text: '保存', iconCls: 'x-fa fa-save'
        });
        me.btnCreate = me.add({
            text: '创建', iconCls: 'x-fa fa-file-medical',
            hidden: !me.getCreating(),
            handler: me.getCreateHandler()
        });
        me.switchButtonStatus();
    },
    updateEditable: function (editalbe) {
        this.switchButtonStatus();
    },
    updateResetHandler: function (updateResetHandler) {
        this.switchButtonStatus();
    },
    updateCreateHandler: function (createHandler) {
        this.switchButtonStatus();
    },
    updateUpdateHandler: function (updateHandler) {
        this.switchButtonStatus();
    },
    updateEditing: function (editing) {
        this.switchButtonStatus();
    },
    updateCreating: function (creating) {
        this.switchButtonStatus();
    },
    toggleEditing: function () {
        this.setEditing(true);
        this.setCreating(false);
    },
    toggleCreating: function () {
        this.setEditing(true);
        this.setCreating(true);
    },
    toggleViewing: function () {
        this.setEditing(false);
        this.setCreating(false);
    },
    switchButtonStatus: function () {
        var me = this,
            btnModify = me.btnModify,
            btnReset = me.btnReset,
            btnCreate = me.btnCreate,
            btnUpdate = me.btnUpdate,
            editable = me.getEditable(),
            resetHandler = me.getResetHandler(),
            createHandler = me.getCreateHandler(),
            updateHandler = me.getUpdateHandler(),
            creating = me.getCreating(),
            editing = me.getEditing();
        if (btnReset) {
            btnReset.setHidden(!resetHandler);
            btnReset.setDisabled(creating);
            btnReset.setHandler(resetHandler);
        }
        if (btnModify) {
            btnModify.setHidden(!editable);
            btnModify.setDisabled(creating);
            btnModify.setPressed(editing || creating);
        }
        if (btnUpdate) {
            btnUpdate.setHidden(!editable || !updateHandler || !editing || creating);
            btnUpdate.setHandler(updateHandler);
        }
        if (btnCreate) {
            btnCreate.setHidden(!createHandler || !creating);
            btnCreate.setHandler(createHandler);
        }
    }
});
