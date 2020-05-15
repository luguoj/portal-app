Ext.define('PSR.view.desktop.Navigation', {
    extend: 'Ext.Panel',
    xtype: 'psr-view-desktop-navigation',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        onMenuItemClick: function (tree, event) {
            if (event.node.isLeaf()) {
                this.redirectTo(event.node.get('id'));
            }
        },
        hBtnLogout: function () {
            PSR.clientSite.ClientSite.logout();
        },
        hBtnMicro: function () {
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
        if (store) {
            if (this.navTree) {
                this.navTree.setStore(store);
            }
        }
    },
    layout: 'vbox',
    bind: {
        title: '{micro ? "" : appTitle}',
        iconCls: '{micro ? "" : appIconCls}',
    },
    constructor: function (config) {
        this.callParent([config]);
        var navBox = this.add({
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
            ui: 'nav',
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
            items: [{
                xtype: 'button',
                iconCls: 'x-fa fa-power-off',
                handler: 'hBtnLogout'
            }, {
                xtype: 'button',
                iconCls: 'x-fa fa-angle-left',
                handler: 'hBtnMicro'
            }]
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
