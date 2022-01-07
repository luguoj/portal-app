Ext.define('PSR.overrides.Ext.ux.TreePicker', {
    override: 'Ext.ux.TreePicker',
    initComponent: function() {
        var me = this;
        this.store = this.store || Ext.data.StoreManager.lookup('ext-empty-store');
        me.callParent(arguments);
    },
    updateStore:function(store){
        this.mon(store, {
            scope: this,
            load: this.onLoad,
            update: this.onUpdate
        });
    },
});
