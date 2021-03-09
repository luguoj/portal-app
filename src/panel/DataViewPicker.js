Ext.define('PSR.panel.DataviewPicker', {
    extend: 'Ext.Container',
    xtype: 'psr-panel-dataviewpicker',
    mixins: ['PSR.mixin.Storable'],
    layout: 'fit',
    config: {
        isTree: false,
        fieldTitle: '',
        displayField: 'displaytext',
        filterFields: [],
        extraParams: {},
        paramConverter: function (values) {
            return values;
        },
    },
    eventedConfig: {
        selection: null
    },
    constructor: function (config) {
        const me = this,
            isTree = config.isTree || this.config.isTree,
            fieldTitle = config.fieldTitle || this.config.fieldTitle,
            displayField = config.displayField || this.config.displayField,
            filterFields = [].concat(config.filterFields || this.config.filterFields || []);
        if (filterFields.length > 0) {
            this.remoteFilter = true;
        }
        const grd = {
            reference: 'grd',
            rowLines: true, columnLines: true,
            columns: [{
                text: fieldTitle, dataIndex: displayField, flex: 1,
                menuDisabled: true
            }],
            listeners: {
                selectionchange: function (grid) {
                    const selections = grid.getSelectable().getSelections(),
                        records = [],
                        notRecords = [];
                    for (let i = 0; i < selections.length; i++) {
                        if (selections[i].get('isRecord')) {
                            records.push(selections[i]);
                        } else {
                            notRecords.push(selections[i])
                        }
                    }
                    grid.getSelectable().deselect(notRecords, true);
                    me.setSelection(records);
                }
            }
        };
        if (isTree) {
            Object.assign(grd, {
                xtype: 'tree',
                rootVisible: false
            });
        } else {
            Object.assign(grd, {
                xtype: 'grid'
            });
        }
        config.items = [grd, {
            xtype: 'psr-panel-form-left', hidden: true,
            items: filterFields
        }, {
            xtype: 'toolbar', docked: 'top', hidden: true,
            items: [{
                xtype: 'textfield', flex: 1
            }]
        }];
        me.callParent([config]);
        me.searchForm = me.down('psr-panel-form-left');
    },
    updateStore: function (store) {
        this.applyStoreProxyParams();
        const grd = this.down(this.getIsTree() ? 'tree' : 'grid');
        grd.setStore(store);
        if (store.getPageSize() && this.getIsTree() != true) {
            grd.addPlugin('gridpagingtoolbar');
        }
    },
    expandFilter: function (expanded) {
        const searchCmp = this.down(this.remoteFilter ? 'psr-panel-form-left' : 'toolbar');
        if (expanded != null) {
            searchCmp.setHidden(!expanded)
        } else {
            searchCmp.setHidden(!searchCmp.getHidden());
        }
    },
    refresh: function () {
        const store = this.getStore();
        if (store) {
            this.applyStoreProxyParams();
            store.reload();
        }
    },
    applyStoreProxyParams: function () {
        const store = this.getStore(),
            searchForm = this.searchForm,
            searchParams = searchForm ? searchForm.getValues() : {},
            extraParams = this.getExtraParams(),
            paramConverter = this.getParamConverter();
        if (store) {
            store.proxy.setExtraParams(paramConverter(Object.assign({}, extraParams, searchParams)));
        }
    }
});
