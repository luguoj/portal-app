Ext.define('PSR.panel.searchDataviewPicker.Base', {
    extend: 'Ext.Container',
    xtype: 'psr-panel-searchdataviewpicker',
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
        hBtnSync:function(){
            this.getView().searchDataView.search();
        },
        hBtbConfirm: function () {
            this.getView().fireEvent('confirm', this.getViewModel().get('selected'));
        },
        hBtbCancel: function () {
            this.getView().fireEvent('cancel');
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
            text: '确认',
            handler: 'hBtbConfirm',
            bind: {disabled: '{!hasSelected}'},
        }, {
            text: '取消',
            handler: 'hBtbCancel'
        }]
    }],
    config: {
        searchDataView: {
            lazy: true,
            $value: {}
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
        return this.getSearchDataView();
    },
    updateStore: function (store) {
        if (this.searchDataView) {
            this.searchDataView.setStore(store);
        }
    }
});
