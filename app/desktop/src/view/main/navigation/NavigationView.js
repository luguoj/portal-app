Ext.define('PortalApp.view.main.NavigationView', {
    extend: 'Ext.panel.Panel',
    xtype: 'main-navigationview',
    mixins: ['PSR.mixin.Storable'],
    controller: 'main-navigationviewcontroller',
    updateStore: function (store) {
        const me = this;
        if (store) {
            if (this.navTree) {
                this.navTree.setStore(store);
            }
        }
        store.addListener('load', function () {
            me.navTree.setIndent(10);
        });
    },
    ui: 'psr-desktop-nav',
    iconCls: 'psr-desktop-nav-app-icon',
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    scrollable: 'y',
    constructor: function (config) {
        this.callParent([config]);
        this.navTree = this.add({
            xtype: 'treelist',
            minHeight: '100%',
            expanderOnly: false,
            expanderFirst: false,
            ui: 'nav',
            store: this.getStore(),
            listeners: {
                itemclick: 'onMenuItemClick'
            }
        });
    },
    switchNode: function (opt) {
        this.getController().switchNode(opt);
    }
});
