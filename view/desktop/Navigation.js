Ext.define('PSR.view.desktop.Navigation', {
    extend: 'Ext.Panel',
    xtype: 'psr-view-desktop-navigation',
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
        initMenu: function (modules) {
            var vm = this.getViewModel(),
                menus = vm.getStore('menus');
            menus.getProxy().setData(modules);
            menus.load();
        },
    },
    viewModel: {
        data: {
            micro: false,
            appTitle: '',
        },
        stores: {
            menus: {
                type: "tree",
                proxy: {
                    type: 'memory',
                    rootProperty: 'result',
                    reader: {
                        transform: function (data) {
                            var opt = {
                                transformNode: function (record, opt) {
                                    record.text = record.description;
                                    return PSR.ReaderTransform.transforCatalogedNode(record, opt);
                                }
                            };
                            var root = PSR.ReaderTransform.pathTree(data, opt);
                            return root;
                        }
                    }
                }
            }
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
    layout: 'vbox',
    bind: {
        title: '{micro ? "" : appTitle}',
        iconCls: '{micro ? "" : appIconCls}',
    },
    items: [{
        flex: 1,
        layout: 'vbox',
        scrollable: 'y',
        items: [{
            xtype: 'treelist',
            expanderOnly: false,
            expanderFirst: false,
            singleExpand: true,
            ui: 'nav',
            bind: {
                micro: '{micro}',
                store: '{menus}'
            },
            listeners: {
                itemclick: 'onMenuItemClick'
            }
        }],
    }, {
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
    }],
    toggleMicro: function () {
        return this.getController().toggleMicro();
    },
    updateSiteTitle: function (newValue, oldValue) {
        this.getViewModel().set('siteTitle', newValue);
    },
    updateSiteIconCls: function (newValue, oldValue) {
        this.setIconCls(newValue + ' psr-title-icon');
    },
    initMenu: function (modules) {
        this.getController().initMenu(modules);
    }
});
