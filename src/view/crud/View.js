Ext.define('PSR.view.crud.View', {
    extend: 'Ext.Panel',
    layout: {type: 'card', animation: 'fade'},
    items: [],
    controller: {},
    viewModel: {},
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
        this.createItemsConfig(config);
        this.createControllerConfig(config);
        this.createViewModelConfig(config);
        this.callParent([config]);
    },
    createItemsConfig: function (config) {
        var items = [{
            xtype: this.listViewXtype,
            actions: config.actions,
            listeners: Object.assign({
                goDetails: 'goDetails'
            }, this.listListeners)
        }, {
            xtype: 'dialog',
            width: 400, maxHeight: '80%',
            layout: 'hbox', padding: 0,
            items: [{
                xtype: this.detailsViewXtype,
                flex: 1,
                actions: config.actions,
                listeners: {
                    goback: 'goBack'
                }
            }]
        }];
        if (this.config.items && this.config.items.length > 0) {
            for (var i = 0; i < this.config.items.length; i++) {
                items.push(Object.assign({actions: config.actions}, this.config.items[i]));
            }
        }
        this.config.items = items;
    },
    createControllerConfig: function (config) {
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
    },
    createViewModelConfig: function (config) {
        this.config.viewModel = Object.assign({}, this.config.viewModel);
    }
});
