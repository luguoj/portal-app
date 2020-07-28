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
    constructor: function (config) {
        this.createItemsConfig();
        this.createControllerConfig();
        this.createViewModelConfig();
        this.callParent([config]);
    },
    createItemsConfig: function () {
        var items = [{
            xtype: this.listViewXtype,
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
                listeners: {
                    goback: 'goBack'
                }
            }]
        }];
        items = items.concat(this.config.items);
        this.config.items = items;
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
    },
    createViewModelConfig: function () {
        this.config.viewModel = Object.assign({}, this.config.viewModel);
    }
});
