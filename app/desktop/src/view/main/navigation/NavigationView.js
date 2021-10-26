Ext.define('PortalApp.view.main.NavigationView', {
    extend: 'Ext.panel.Panel',
    xtype: 'main-navigationview',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        onMenuItemClick: function (tree, event) {
            if (event.node.isLeaf() && event.node.data.viewConfig) {
                this.redirectTo(event.node.get('id'));
            }
        },
        switchNode: function (node) {
            var v = this.getView(),
                navigationNodes = v.getStore(),
                navigationNode = navigationNodes.findNode("id", node.data.id);
            if (navigationNode) {
                this.getView().getAt(0).getAt(0).setSelection(navigationNode);
            }
        }
    },
    viewModel: {
        data: {
            appTitle: '',
        }
    },
    config: {
        appIconCls: '',
        appTitle: ''
    },
    updateAppTitle: function (value) {
        this.getViewModel().set('appTitle', value);
    },
    updateAppIconCls: function (value) {
        this.getViewModel().set('appIconCls', value);
    },
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
    bind: {
        title: '{appTitle}',
        iconCls: '{appIconCls}',
    },
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
    updateSiteIconCls: function (newValue, oldValue) {
        this.setIconCls(newValue + ' psr-title-icon');
    },
    switchNode: function (node) {
        this.getController().switchNode(node);
    }
});
