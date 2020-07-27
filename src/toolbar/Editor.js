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
        if (me.getResetHandler()) {
            me.btnRefresh = me.add({
                tooltip: '重置', iconCls: 'x-fa fa-undo',
                disabled: me.getCreating(),
                handler: me.getResetHandler()
            });
        }
        if (me.getEditable()) {
            me.btnModify = me.add({
                tooltip: '修改', iconCls: 'x-fa fa-edit',
                enableToggle: true,
                disabled: !me.getCreating(),
                pressed: me.getEditing() || me.getCreating(),
                toggleHandler: function (button, pressed) {
                    if (pressed) {
                        me.toggleEditing();
                    } else {
                        me.toggleViewing();
                    }
                }
            });
            if (me.getUpdateHandler()) {
                me.btnUpdate = me.add({
                    tooltip: '保存', iconCls: 'x-fa fa-save',
                    hidden: !me.getEditing() || me.getCreating(),
                    handler: me.getUpdateHandler()
                });
            }
            if (me.getCreateHandler()) {
                me.btnCreate = me.add({
                    tooltip: '创建', iconCls: 'x-fa fa-plus',
                    hidden: !me.getCreating(),
                    handler: me.getCreateHandler()
                });
            }
        }
    },
    updateEditing: function (value) {
        var me = this,
            btnModify = me.btnModify,
            btnUpdate = me.btnUpdate,
            creating = me.getCreating();
        if (btnModify) {
            btnModify.setPressed(value || creating);
        }
        if (btnUpdate) {
            btnUpdate.setHidden(!value || creating)
        }
    },
    updateCreating: function (value) {
        var me = this,
            btnModify = me.btnModify,
            btnRefresh = me.btnRefresh,
            btnCreate = me.btnCreate,
            btnUpdate = me.btnUpdate,
            editing = me.getEditing();
        if (btnModify) {
            btnModify.setDisabled(value);
            btnModify.setPressed(value || editing);
        }
        if (btnUpdate) {
            btnUpdate.setHidden(!editing || value)
        }
        if (btnCreate) {
            btnCreate.setHidden(!value);
        }
        if (btnRefresh) {
            btnRefresh.setDisabled(value);
        }
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
    }
});
