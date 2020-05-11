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
            const v = this.getViewModel(),
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
                records,
                selectedItems = [],
                unselectedItems = [];

            if (store && !store.isLoading() && !store.isLoaded()) {
                store.load();
                return;
            }
            for (var i = 0; i < values.length; i++) {
                valuesMap[values[i]] = true;
                if (store) {
                    var selectedItem = store.findRecord(valueField, values[i]);
                    if (selectedItem) {
                        selectedItem = Object.assign({}, selectedItem.data);
                    } else {
                        selectedItem = {};
                        selectedItem[displayField] = values[i];
                        selectedItem[valueField] = values[i];
                    }
                    selectedItems.push(selectedItem);
                }
            }
            if (store) {
                records = v.getStore().getData().items;
            }
            if (records) {
                for (var i = 0; i < records.length; i++) {
                    if (!valuesMap[records[i].data[valueField]]) {
                        var unselectedItem = Object.assign({}, records[i].data);
                        unselectedItems.push(unselectedItem);
                    }
                }
            }
            vm.getStore('selectedItems').loadData(selectedItems);
            vm.getStore('unselectedItems').loadData(unselectedItems);
            v.selectedDataview.getStore().getProxy().setData(selectedItems);
            v.selectedDataview.getStore().load();
            v.unselectedDataview.getStore().getProxy().setData(unselectedItems)
            v.unselectedDataview.getStore().load();
            v.down('searchfield').setValue('');
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
            const v = this.getView(),
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
            const v = this.getView();
            v.setValue('');
        },
    },
    viewModel: {
        data: {
            loadmask: null,
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
        this.getAt(1).disable();
        this.getViewModel().set('loadmask', {xtype: 'loadmask', message: '加载中...'});
        // this.getAt(2).mask({xtype: 'loadmask', message: '加载中...'});
        // this.getAt(0).mask({xtype: 'loadmask', message: '加载中...'});
    },
    onStoreLoad: function (store, records, success) {
        if (success) {
            this.getController().syncSelection();
        }
        this.getViewModel().set('loadmask', null);
        // this.getAt(2).unmask();
        // this.getAt(0).unmask();
    },
    minHeight: '300',
    layout: 'hbox',
    constructor: function (config) {
        this.callParent([config]);
        this.add([{
            xtype: 'panel',
            flex: 1,
            border: true,
            layout: 'fit',
            bind: {hidden: '{fieldDisabled}', masked: '{loadmask}'}
        }, {
            xtype: 'toolbar',
            layout: 'vbox',
            items: ['->', {
                iconCls: 'x-fa fa-angle-double-right', ui: 'action',
                handler: 'hBtnAddAll',
                bind: {disabled: '{!!loadmask}'}
            }, {
                iconCls: 'x-fa fa-angle-right', ui: 'action',
                handler: 'hBtnAdd',
                bind: {disabled: '{!!loadmask}'}
            }, {
                iconCls: 'x-fa fa-angle-left', ui: 'action',
                handler: 'hBtnRemove',
                bind: {disabled: '{!!loadmask}'}
            }, {
                iconCls: 'x-fa fa-angle-double-left', ui: 'action',
                handler: 'hBtnRemoveAll',
                bind: {disabled: '{!!loadmask}'}
            }, '->'],
            bind: {hidden: '{fieldDisabled}'}
        }, {
            xtype: 'panel',
            flex: 1,
            border: true,
            layout: 'fit',
            bind: {masked: '{loadmask}'}
        }, {
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                xtype: 'button', iconCls: 'x-fa fa-sync', text: '刷新',
                handler: 'doRefresh',
                bind: {disabled: '{!!loadmask}'}
            }, {
                xtype: 'searchfield',
                flex: 1,
                ui: 'solo',
                placeholder: '搜索',
                listeners: {
                    buffer: 300,
                    change: 'doSearch'
                },
                bind: {disabled: '{!!loadmask}'}
            }]
        }]);
        this.selectedDataview = this.getAt(2).add(this.createSelectedDataview());
        this.selectedDataview.on({
            selectionchange: 'onSelectionChange'
        });
        this.unselectedDataview = this.getAt(0).add(this.createUnselectedDataview());
        this.unselectedDataview.on({
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
