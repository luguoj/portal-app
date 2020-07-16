Ext.define('PSR.panel.crud.search.Base', {
    extend: 'Ext.Container',
    xtype: 'psr-panel-crud-search',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        beforeSelect: function (grid, selected) {
            return selected;
        },
        onSelectionChange: function (grid) {
            var v = this.getViewModel(),
                _selected = [],
                newSelected = this.beforeSelect(grid, grid.getSelectable().getSelections());
            if (newSelected && newSelected.length > 0) {
                for (var i = 0; i < newSelected.length; i++) {
                    _selected.push(newSelected[i]);
                }
                v.set('selected', _selected);
                v.set('hasSelected', true);
            } else {
                v.set('selected');
                v.set('hasSelected', false);
            }
        },
        onBtnSearchToggle: function (button, pressed) {
            this.getView().searchDataView.setHideSearchView(!pressed);
        },
        hBtnSync: function () {
            this.getView().searchDataView.search();
        },
        hBtnAdd: function () {
            var v = this.getView(), vm = this.getViewModel();
            v.fireEvent('createrecord')
        },
        hBtnCopy: function () {
            var v = this.getView(), vm = this.getViewModel(), selected = vm.get('selected');
            if (selected && selected.length > 0) {
                v.fireEvent('copyrecord', selected[0]);
            }
        },
        hBtnDelete: function () {
            var v = this.getView(), vm = this.getViewModel(), selected = vm.get('selected');
            if (selected && selected.length > 0) {
                Ext.Msg.confirm("确认删除", "即将删除: " + selected[0].data[v.getDisplayField()],
                    function (buttonId, value, opt) {
                        if (buttonId == 'yes') {
                            v.mask();
                            v.getApi().delete({
                                id: selected[0].data.id,
                                success: function (data) {
                                    Ext.toast('删除成功');
                                    v.getStore().reload();
                                },
                                failure: function () {
                                    Ext.toast("删除失败");
                                },
                                complete: function () {
                                    v.unmask();
                                }
                            });
                        }
                    });
            }

        },
        hToolDetails: function (grid, event) {
            var v = this.getView();
            v.fireEvent('godetails', event.record);
        },
        goDetails: function (record) {
            var v = this.getView();
            v.fireEvent('godetails', record);
        }
    },
    viewModel: {
        data: {
            enableSearcher: true,
            hasSelected: false,
            selected: null,
        }
    },
    layout: 'fit',
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            text: '过滤', iconCls: 'x-fa fa-filter',
            enableToggle: true,
            toggleHandler: 'onBtnSearchToggle',
            bind: {hidden: '{!enableSearcher}'}
        }, {
            text: '刷新', iconCls: 'x-fa fa-sync',
            handler: 'hBtnSync',
            bind: {hidden: '{enableSearcher}'}
        }, '->', {
            text: '增加', iconCls: 'x-fa fa-file-medical',
            handler: 'hBtnAdd'
        }, {
            text: '复制', iconCls: 'x-fa fa-copy',
            handler: 'hBtnCopy',
            bind: {disabled: '{!hasSelected}'},
        }, {
            text: '删除', iconCls: 'x-fa fa-file-excel',
            handler: 'hBtnDelete',
            bind: {disabled: '{!hasSelected}'},
        }]
    }],
    config: {
        api: null,
        displayField: 'text',
        displayFieldHeader: 'Text',
        searchDataView: {
            lazy: true,
            $value: null
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.searchDataView = this.add(this.createSearchDataView());
        this.searchDataView.setStore(this.getStore());
        this.searchDataView.on({
            selectionchange: 'onSelectionChange'
        });
        this.getViewModel().set('enableSearcher', !!this.searchDataView.searchView);
    },
    createSearchDataView: function () {
        var searchDataView = this.getSearchDataView();
        return searchDataView;
    },
    updateStore: function (store) {
        if (this.searchDataView) {
            this.searchDataView.setStore(store);
        }
    }
});
