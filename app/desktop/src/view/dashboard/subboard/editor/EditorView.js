Ext.define('PortalApp.view.dashboard.subBoard.EditorView', {
    extend: 'Ext.window.Window',
    xtype: 'dashboard-subboard-editorview',
    config: {
        boardConfig: null
    },
    constrain: true,
    title: '板块配置',
    width: '25%',
    height: '50%',
    layout: 'fit',
    bodyPadding: 10,
    tools: [{
        iconCls: 'x-fa fa-clipboard-check',
        tooltip: '校验',
        handler: 'hBtnCheck',
        bind: {
            disabled: '{!dirty}'
        }
    }, {
        iconCls: 'x-fa fa-save',
        tooltip: '保存',
        handler: 'hBtnSave',
        bind: {
            disabled: '{!dirty}'
        }
    }, {
        iconCls: 'x-fa fa-redo-alt',
        tooltip: '还原',
        handler: 'hBtnRefresh'
    }],
    items: [{
        xtype: 'form',
        reference: 'form',
        padding: 10,
        trackResetOnLoad: true,
        defaults: {
            anchor: '100%'
        },
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'textareafield',
            name: 'boardConfig',
            flex: 1
        }],
        listeners: {
            dirtychange: 'onFrmDirtyChange'
        }
    }],
    updateBoardConfig: function (value) {
        this.getViewModel().set('boardConfig', value);
        this.getController().loadData();
    },
    controller: 'dashboard-subboard-editorviewcontroller',
    viewModel: {
        data: {
            boardConfig: null,
            dirty: false
        }
    }
});
