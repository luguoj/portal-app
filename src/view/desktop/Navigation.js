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
        initNodes: function (nodes) {
            var vm = this.getViewModel(),
                navigationNodes = vm.getStore('navigationNodes');
            navigationNodes.getProxy().setData(nodes);
            navigationNodes.load();
        },
        switchNode: function (node) {
            var vm = this.getViewModel(),
                navigationNodes = vm.getStore('navigationNodes'),
                navigationNode = navigationNodes.findNode("id", node.data.id);
            if (navigationNode) {
                this.getView().getAt(0).getAt(0).setSelection(navigationNode)
                // while (navigationNode.parentNode) {
                //     navigationNode.parentNode.expand()
                //     navigationNode = parentNode;
                // }
            }
        }
    },
    viewModel: {
        data: {
            micro: false,
            appTitle: '',
        },
        stores: {
            navigationNodes: {
                type: "tree",
                proxy: {
                    type: 'memory',
                    rootProperty: 'result',
                    reader: {
                        transform: function (data) {
                            var roots = [];
                            if (data && data.length > 0) {
                                var nodeMap = {};
                                for (let i = 0; i < data.length; i++) {
                                    var record = data[i];
                                    if (record.iconCls == null) {
                                        delete record.iconCls;
                                    }
                                    nodeMap[record.id] = Object.assign({leaf: true, result: []}, record);
                                }
                                for (const nodeMapKey in nodeMap) {
                                    var node = nodeMap[nodeMapKey];
                                    if (node.parentId && nodeMap[node.parentId]) {
                                        var parentNode = nodeMap[node.parentId];
                                        parentNode.leaf = false
                                        parentNode.result.push(node);
                                    } else {
                                        roots.push(node);
                                    }
                                }
                            }
                            return roots;
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
                store: '{navigationNodes}'
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
    initNodes: function (nodes) {
        this.getController().initNodes(nodes);
    },
    switchNode: function (node) {
        this.getController().switchNode(node);
    }
});
