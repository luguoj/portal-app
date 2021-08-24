Ext.define('PSR.view.desktop.Navigation', {
    extend: 'Ext.Panel',
    xtype: 'psr-view-desktop-navigation',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        onMenuItemClick: function (tree, event) {
            if (event.node.isLeaf() && event.node.data.viewConfig) {
                this.redirectTo(event.node.get('id'));
            }
        },
        toggleMicro: function () {
            var vm = this.getViewModel();
            vm.set('micro', !vm.get('micro'));
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
            micro: false,
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
    layout: 'vbox',
    ui: 'psr-desktop-nav',
    bind: {
        title: '{micro ? "" :"&nbsp" + appTitle}',
        iconCls: '{appIconCls}',
    },
    constructor: function (config) {
        this.callParent([config]);
        var navBox = this.add({
            userCls: 'nav-container',
            flex: 1,
            layout: 'vbox',
            scrollable: 'y',
            items: [],
        });
        this.navTree = navBox.add({
            xtype: 'treelist',
            expanderOnly: false,
            expanderFirst: false,
            singleExpand: true,
            ui: 'psr-desktop-nav-tree',
            store: this.getStore(),
            bind: {
                micro: '{micro}'
            },
            listeners: {
                itemclick: 'onMenuItemClick'
            }
        });
        this.add({
            layout: 'vbox',
            items: []
        });
    },
    toggleMicro: function () {
        return this.getController().toggleMicro();
    },
    updateSiteTitle: function (newValue, oldValue) {
        this.getViewModel().set('siteTitle', newValue);
    },
    updateSiteIconCls: function (newValue, oldValue) {
        this.setIconCls(newValue + ' psr-title-icon');
    },
    switchNode: function (node) {
        this.getController().switchNode(node);
    }
});
