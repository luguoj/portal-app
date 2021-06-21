Ext.define('PSR.view.desktop.BackendTaskList', {
    xtype: 'psr-view-desktop-backendtasklist',
    extend: 'Ext.Dialog',
    mixins: ['PSR.mixin.Storable'],
    title: '后台任务', closable: true,
    width: '50%',
    height: '85%',
    layout: 'fit', padding: 0,
    items: [{
        xtype: 'list',
        itemTpl: '<div style="margin:0px 5px" class="x-icon-el x-font-icon {iconCls}"></div>{text}',
        onItemDisclosure: 'onDisclosure',
        plugins: {
            listswiper: {
                right: [{
                    iconCls: 'x-fa fa-trash-alt',
                    ui: 'alt decline',
                    commit: 'onExitTask',
                    undoable: true
                }]
            }
        }
    }, {
        xtype: 'button', docked: 'bottom',
        ui: 'alt decline', iconCls: 'x-fa fa-trash-alt', text: '全部关闭',
        handler: 'onExitAllTask'
    }],
    updateStore: function (store) {
        const list = this.down('list');
        if (list) {
            list.setStore(store);
        }
    },
    controller: {
        onDisclosure: function (record) {
            this.getView().fireEvent('disclosure', record);
        },
        onExitTask: function (list, info) {
            this.getView().fireEvent('exittask', [info.record]);
        },
        onExitAllTask: function () {
            const view = this.getView();
                store = view.getStore(),
                data = store.getData();
            if (data && data.items && data.items.length) {
                this.getView().fireEvent('exittask', [].concat(data.items));
            }
        }
    }
});
