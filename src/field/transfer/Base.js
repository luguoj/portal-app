Ext.define('PSR.field.transfer.Base', {
    extend: 'Ext.field.Container',
    xtype: 'psr-field-transfer',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        doSearch: function (field, value) {
            var me = this,
                v = this.getView(),
                selectedStore = v.selectedDataview.getStore(),
                unselectedStore = v.unselectedDataview.getStore();

            if (value && value.length > 0) {
                selectedStore.getFilters().replaceAll({
                    property: v.getDisplayField(),
                    value: new RegExp(Ext.String.escapeRegex(value), 'i')
                });
                unselectedStore.getFilters().replaceAll({
                    property: v.getDisplayField(),
                    value: new RegExp(Ext.String.escapeRegex(value), 'i')
                });
            } else {
                selectedStore.clearFilter();
                unselectedStore.clearFilter();
            }
        },
        doRefresh: function () {
            var v = this.getView(),
                store = v.getStore();
            if (store && !store.isLoading()) {
                store.reload();
            }
        },
        beforeSelect: function (grid, selected) {
            return selected;
        },
        onSelectionChange: function (grid) {
            var v = this.getViewModel(),
                _selected = [],
                newSelected = this.beforeSelect(grid, grid.getSelectable().getSelections());
            if (newSelected && newSelected.length > 0) {

            } else {
            }
        },
        syncSelection: function () {
            var v = this.getView(),
                vm = this.getViewModel(),
                store = v.getStore(),
                valueField = v.getValueField(),
                displayField = v.getDisplayField(),
                values = v.getValue() ? v.getValue().split(',') : [],
                valuesMap = {},
                records = [],
                selectedItems = [],
                unselectedItems = [];
            if (store && store.isLoading()) {
                this.getViewModel().set('loadmask', {xtype: 'loadmask', message: '加载中...'});
                return;
            }
            if (store && !store.isLoaded()) {
                store.load();
                return;
            }
            vm.set('doingAction', true);
            setTimeout(function () {
                if (store) {
                    records = v.getStore().getData().items;
                }
                for (let i = 0; i < records.length; i++) {
                    let valueIndex = values.indexOf(records[i].data[valueField]);
                    let item = Object.assign({}, records[i].data);
                    if (valueIndex >= 0) {
                        selectedItems.push(item);
                        values.splice(valueIndex, 1);
                    } else {
                        unselectedItems.push(item);
                    }
                }
                for (let i = 0; i < values.length; i++) {
                    var selectedItem = {};
                    selectedItem[displayField] = values[i];
                    selectedItem[valueField] = values[i];
                    selectedItems.push(selectedItem);
                }
                vm.getStore('selectedItems').loadData(selectedItems);
                vm.getStore('unselectedItems').loadData(unselectedItems);
                v.selectedDataview.getStore().getProxy().setData(selectedItems);
                v.selectedDataview.getStore().load();
                v.unselectedDataview.getStore().getProxy().setData(unselectedItems)
                v.unselectedDataview.getStore().load();
                v.down('searchfield').setValue('');
                vm.set('doingAction', false);
                vm.set('loadmask', null);
            }, 50);
        },
        hBtnAdd: function () {
            var v = this.getView(),
                vm = this.getViewModel(),
                valueField = v.getValueField(),
                selectedItems = vm.getStore('selectedItems').getData().items,
                itemsToAdd = v.unselectedDataview.getSelected().items,
                values = [];
            for (var i = 0; i < selectedItems.length; i++) {
                values.push(selectedItems[i].data[valueField]);
            }
            for (var i = 0; i < itemsToAdd.length; i++) {
                values.push(itemsToAdd[i].data[valueField]);
            }
            v.setValue(values.join(','));
        },
        hBtnAddAll: function () {
            var v = this.getView(),
                vm = this.getViewModel(),
                valueField = v.getValueField(),
                items = v.getStore().getData().items,
                values = [];
            for (var i = 0; i < items.length; i++) {
                values.push(items[i].data[valueField]);
            }
            v.setValue(values.join(','));
        },
        hBtnRemove: function () {
            var v = this.getView(),
                vm = this.getViewModel(),
                valueField = v.getValueField(),
                selectedItems = vm.getStore('selectedItems').getData().items,
                itemsToRemove = v.selectedDataview.getSelected().items,
                values = [];
            for (var i = 0; i < selectedItems.length; i++) {
                let value = selectedItems[i].data[valueField];
                for (let j = 0; j < itemsToRemove.length; j++) {
                    if (itemsToRemove[j].data[valueField] == value) {
                        value = null;
                        break;
                    }
                }
                if (value) {
                    values.push(value);
                }
            }
            v.setValue(values.join(','));
        },
        hBtnRemoveAll: function () {
            var v = this.getView();
            v.setValue('');
        },
    },
    viewModel: {
        data: {
            loadmask: null,
            doingAction: false,
            fieldLabel: '',
            fieldDisabled: false,
            hasUnselectedItemsSelected: true, // TODO
            hasSelectedItemsSelected: true, // TODO
        },
        stores: {
            unselectedItems: {data: []},
            selectedItems: {data: []}
        }
    },
    config: {
        valueField: 'value',
        displayField: 'text',
        sortField: 'text',
        selectedDataview: {
            lazy: true,
            $value: {}
        },
        unselectedDataview: {
            lazy: true,
            $value: {}
        }
    },
    updateValue: function (value) {
        this.getController().syncSelection();
    },
    updateDisabled: function (value) {
        this.getViewModel().set('fieldDisabled', value);
        this.callParent([value]);
    },
    updateStore: function (store) {
        this.getController().syncSelection();
    },
    onStoreBeforeLoad: function () {
        this.getViewModel().set('loadmask', {xtype: 'loadmask', message: '加载中...'});
    },
    onStoreLoad: function (store, records, success) {
        if (success) {
            this.getController().syncSelection();
        }
    },
    minHeight: '300',
    layout: 'fit',
    items: [{
        xtype: 'panel',
        layout: 'hbox',
        bind: {masked: '{loadmask}'}
    }],
    constructor: function (config) {
        this.callParent([config]);
        var panel = this.getAt(0);
        panel.add([{
            xtype: 'panel',
            flex: 1,
            border: true,
            layout: 'fit',
            bind: {hidden: '{fieldDisabled}'}
        }, {
            xtype: 'panel',
            flex: 1,
            border: true,
            layout: 'fit'
        }, {
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button',
                iconCls: 'x-fa fa-sync', tooltip: '刷新',
                handler: 'doRefresh',
                bind: {disabled: '{doingAction}'}
            }, {
                xtype: 'searchfield',
                flex: 1,
                ui: 'solo',
                placeholder: '搜索',
                listeners: {
                    buffer: 300,
                    change: 'doSearch'
                },
                bind: {disabled: '{doingAction}'}
            }, {
                iconCls: 'x-fa fa-angle-double-right', ui: 'action',
                handler: 'hBtnAddAll',
                bind: {disabled: '{doingAction}', hidden: '{fieldDisabled}'}
            }, {
                iconCls: 'x-fa fa-angle-right', ui: 'action',
                handler: 'hBtnAdd',
                bind: {disabled: '{doingAction}', hidden: '{fieldDisabled}'}
            }, {
                iconCls: 'x-fa fa-angle-left', ui: 'action',
                handler: 'hBtnRemove',
                bind: {disabled: '{doingAction}', hidden: '{fieldDisabled}'}
            }, {
                iconCls: 'x-fa fa-angle-double-left', ui: 'action',
                handler: 'hBtnRemoveAll',
                bind: {disabled: '{doingAction}', hidden: '{fieldDisabled}'}
            }]
        }]);
        this.selectedDataview = panel.getAt(1).add(this.createSelectedDataview());
        this.unselectedDataview = panel.getAt(0).add(this.createUnselectedDataview());
        var me = this, vm = me.getViewModel();
        me.selectedDataview.on({
            selectionchange: 'onSelectionChange'
        });
        me.unselectedDataview.on({
            selectionchange: 'onSelectionChange'
        });
    },
    createSelectedDataview: function () {
        return this.getSelectedDataview();
    },
    createUnselectedDataview: function () {
        return this.getUnselectedDataview();
    }
});
