Ext.define('common.patch.Ext.list.Tree', {
    override: 'Ext.list.Tree',
    privates: {
        onRefresh: function(store) {
            // this.onRootChange(store.getRoot()); THIS WILL TRIGGER BUGS
            // DO NOTINGH;
        }
    }
});
