Ext.define('PSR.panel.crud.Base', {
    extend: 'Ext.Panel',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        onSearchViewGoDetails: function (record) {
            var v = this.getView(), detailsView = v.detailsView;
            detailsView.loadRecord(record.data.id);
            v.setActiveItem(detailsView);
        },
        onSearchViewCreateRecord: function () {
            var v = this.getView(), detailsView = v.detailsView;
            detailsView.createRecord();
            v.setActiveItem(detailsView);
        },
        onSearchViewCopyRecord: function (record) {
            var v = this.getView(), detailsView = v.detailsView;
            detailsView.copyRecord(record.data.id);
            v.setActiveItem(detailsView);
        },
        onDetailsViewGoback: function (datachanged) {
            var v = this.getView(), searchView = v.searchView;
            v.setActiveItem(searchView);
            if (datachanged) {
                v.getStore().reload();
            }
        }
    },
    viewModel: {},
    layout: 'card',
    config: {
        searchView: {
            lazy: true,
            $value: null
        },
        detailsView: {
            lazy: true,
            $value: {
                xtype: 'psr-panel-crud-details'
            }
        },
        api: {
            load: function (id, success, failure) {
            },
            create: function (values, success, failure) {
            },
            update: function (values, success, failure) {
            }
        },
    },
    updateStore: function (store) {
        if (this.searchView) {
            this.searchView.setStore(store);
        }
    },
    applyApi: function (api) {
        if (Ext.isString(api)) {
            return Ext.ClassManager.get(api);
        }
        return api;
    },
    updateApi: function (api) {
        if (this.searchView) {
            this.searchView.setApi(api);
        }
        if (this.detailsView) {
            this.detailsView.setApi(api);
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.searchView = this.add(this.createSearchView());
        this.searchView.setStore(this.getStore());
        this.searchView.setApi(this.getApi());
        this.searchView.on({
            godetails: 'onSearchViewGoDetails',
            createrecord: 'onSearchViewCreateRecord',
            copyrecord: 'onSearchViewCopyRecord'
        })
        this.detailsView = this.add(this.createDetailsView());
        this.detailsView.setApi(this.getApi());
        this.detailsView.on({
            goback: 'onDetailsViewGoback'
        });
    },
    createSearchView: function () {
        return this.getSearchView();
    },
    createDetailsView: function () {
        return this.getDetailsView();
    }
});
