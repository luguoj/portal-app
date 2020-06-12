Ext.define('PSR.panel.filterDataviewPicker.Base', {
    extend: 'Ext.Container',
    xtype: 'psr-panel-filterdataviewpicker',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        beforeSelect: function (grid, selected) {
            return selected;
        },
        onSelectionChange: function (grid) {
            const v = this.getViewModel(),
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
        hBtnSync: function () {
            this.getView().filterDataView.search();
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
            hasSelected: false,
            selected: null,
        }
    },
    layout: 'fit',
    items: [{
        xtype: 'toolbar',
        docked: 'top',
        items: [{
            text: '刷新', iconCls: 'x-fa fa-sync',
            handler: 'hBtnSync'
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
        filterDataView: {
            lazy: true,
            $value: {}
        }
    },
    constructor: function (config) {
        this.callParent([config]);
        this.filterDataView = this.add(this.createFilterDataView());
        this.filterDataView.setStore(this.getStore());
        this.filterDataView.on({
            selectionchange: 'onSelectionChange'
        });
    },
    createFilterDataView: function () {
        return this.getFilterDataView();
    },
    updateStore: function (store) {
        if (this.filterDataView) {
            this.filterDataView.setStore(store);
        }
    }
});
