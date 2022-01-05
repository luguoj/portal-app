Ext.define('PortalApp.view.dashboard.SubBoardView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard-subboardview',
    config: {
        boardId: '',
        editing: false,
        boardConfig: null,
        subBoardConfigs: null
    },
    layout: {type: 'vbox', align: 'stretch'},
    items: [{
        xtype: 'panel',
        flex: 1,
        frame: true,
        layout: 'absolute',
        items: [{
            xtype: 'container',
            reference: 'ctContent',
            anchor: '100% 100%',
            layout: 'fit'
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-cog',
            tooltip: '配置',
            style: {
                'background-color': null
            },
            border: 1,
            x: 0, y: 0, width: 32, height: 32,
            handler: 'hBtnConfig',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            xtype: 'button',
            iconCls: 'x-fa fa-times',
            tooltip: '删除',
            style: {
                'background-color': null
            },
            border: 1,
            x: 32, y: 0, width: 32, height: 32,
            handler: 'hBtnRemove',
            bind: {
                hidden: '{!editing}'
            }
        }, {
            x: 72, y: 8,
            bind: {
                html: '{boardId}',
                hidden: '{!editing||split}'
            }
        }],
        bind: {
            hidden: '{split}'
        }
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-plus',
        border: 1,
        handler: 'hBtnAdd',
        bind: {
            hidden: '{!editing}'
        }
    }],
    updateBoardId: function (value) {
        this.getViewModel().set('boardId', value);
        this.getController().updateBoardId(value);
    },
    updateEditing: function (value) {
        this.getViewModel().set('editing', value);
        this.getController().loadData();
    },
    updateBoardConfig: function (value) {
        this.getController().loadData();
    },
    readBoardConfigTree: function () {
        return this.getController().readBoardConfigTree();
    },
    controller: 'dashboard-subboardviewcontroller',
    viewModel: {
        data: {
            boardId: '',
            editing: false,
            split: false
        },
        stores: {}
    }
});