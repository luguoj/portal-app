Ext.define('PSR.overrides.Ext.ux.TreePicker', {
    override: 'Ext.ux.TreePicker',
    config: {
        rootVisible: false
    },
    initComponent: function () {
        var me = this;
        this.store = this.store || Ext.StoreMgr.lookup({
            type: 'tree',
            proxy: 'memory'
        });
        me.callParent(arguments);
    },
    updateStore: function (store) {
        this.mon(store, {
            scope: this,
            load: this.onLoad,
            update: this.onUpdate
        });
    },
    createPicker: function () {
        var me = this,
            picker = new Ext.tree.Panel({
                baseCls: Ext.baseCSSPrefix + 'boundlist',
                shrinkWrapDock: 2,
                store: me.store,
                floating: true,
                displayField: me.displayField,
                columns: me.columns,
                minHeight: me.minPickerHeight,
                maxHeight: me.maxPickerHeight,
                manageHeight: true,
                shadow: false,
                rootVisible: me.rootVisible,
                listeners: {
                    scope: me,
                    itemclick: me.onItemClick,
                    itemkeydown: me.onPickerKeyDown
                }
            }),
            view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar
            // when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off.
            // Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }

        return picker;
    },
});
