Ext.define('PSR.view.crud.View', {
    extend: 'Ext.Panel',
    layout: {type: 'card', animation: 'fade'},
    items: [],
    controller: {},
    viewModel: {},
    isViewClassInit: false,
    // 抽象成员
    listViewXtype: '',
    listListeners: {},
    detailsViewXtype: '',
    config: {
        actions: {
            create: true,
            clone: true,
            delete: true,
            update: true
        }
    },
    constructor: function (config) {
        if (!this.isViewClassInit) {
            this.createItemsConfig();
            this.createViewModelConfig();
            this.createControllerConfig();
            this.isViewClassInit = true;
        }
        this.callParent([config]);
    },
    updateActions: function (actions) {
        const vm = this.getViewModel(),
            vmactions = vm.get('actions');
        if (actions) {
            for (const actionsKey in actions) {
                vmactions[actionsKey] = actions[actionsKey];
            }
        }
    },
    createItemsConfig: function () {
        var defaultItems = this.config.items;
        var items = [{
            xtype: this.listViewXtype,
            bind: {actions: '{actions}'},
            listeners: Object.assign({
                goDetails: 'goDetails'
            }, this.listListeners)
        }, {
            xtype: 'psr-dialog-subview',
            items: [{
                xtype: this.detailsViewXtype,
                flex: 1,
                bind: {actions: '{actions}'},
                listeners: {
                    goback: 'goBack'
                }
            }]
        }];
        if (defaultItems && defaultItems.length > 0) {
            for (var i = 0; i < defaultItems.length; i++) {
                if (defaultItems[i].items && defaultItems[i].items.length > 0) {
                    const subView = defaultItems[i].items[0];
                    if (!subView.bind) {
                        subView.bind = {};
                    }
                    subView.bind.actions = '{actions}';
                }
            }
            items = items.concat(defaultItems);
        }
        this.config.items = items;
    },
    createViewModelConfig: function () {
        var viewModel = Object.assign({}, this.config.viewModel),
            data,
            actions = this.config.actions;
        this.config.viewModel = viewModel;
        // 组装data
        data = {actions: actions};
        viewModel.data = Object.assign(data, viewModel.data);
    },
    createControllerConfig: function () {
        var controller = {
            goBack: function (dirty) {
                var v = this.getView(),
                    listView = v.getAt(0),
                    topView = v.topView;
                topView.hide();
                if (dirty) {
                    if (dirty.id) {
                        listView.refreshRecord(dirty);
                    } else {
                        listView.refresh();
                    }
                }
            },
            goDetails: function (record) {
                this.goSubView(1, record);
            },
            goSubView: function (viewindex, record) {
                var v = this.getView(),
                    detailsView = v.getAt(viewindex);
                v.topView = detailsView;
                detailsView.show();
                if (detailsView.getAt(0).loadEntity) {
                    detailsView.getAt(0).loadEntity(record);
                }
            }
        };
        controller = Object.assign(controller, this.config.controller)
        this.config.controller = controller;
    }
});
