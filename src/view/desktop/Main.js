Ext.define('PSR.view.desktop.Main', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        routes: {
            ':nodeId': {action: 'mainRoute'}
        },
        mainRoute: function (nodeId) {
            var v = this.getView(),
                nodes = v.getStore();
            if (nodes.isLoaded()) {
                this.switchNode(nodeId);
            } else {
                this.switchingNodeId = nodeId;
            }
        },
        switchNode: function (nodeId) {
            var v = this.getView(),
                vm = this.getViewModel(),
                nodes = v.getStore(),
                targetNode;
            targetNode = nodes.isTreeStore
                ? nodes.findNode('id', nodeId)
                : nodes.findRecord('id', nodeId);
            if (targetNode == null) {
                console.log('unmatchedRoute: ' + nodeId);
                return;
            }
            v.workspaceView.switchNode(targetNode);
            v.navigationView.switchNode(targetNode);
            vm.set('moduleTitle', targetNode.data.text);
            vm.set('moduleIconCls', targetNode.data.iconCls);
        },
        hBtnOutdent: function () {
            var v = this.getView();
            v.navigationView.toggleMicro();
        },
        hBtnBackendTaskList: function () {
            const me = this, v = this.getView(), dlg = Ext.create('PSR.view.desktop.BackendTaskList', {
                store: this.getStore('backendTasks'),
                listeners: {
                    disclosure: function (record) {
                        dlg.close();
                        me.switchNode(record.id);
                    },
                    exittask: function (records) {
                        v.workspaceView.exitNode(records);
                    }
                }
            });
            dlg.show();
        },
        hBtnExpand: function () {
            var v = this.getView();
            v.titleView.hide(true);
            v.navigationView.hide(true);
            v.btnCompress.show(true);
        },
        hBtnCompress: function () {
            var v = this.getView();
            v.titleView.show(true);
            v.navigationView.show(true);
            v.btnCompress.hide(true);
        },
        hBtnLogout: function () {
            Ext.Msg.confirm("登出",
                "是否要登出当前用户",
                function (buttonId) {
                    if (buttonId == 'yes') {
                        PSR.clientSite.ClientSite.logout();
                    }
                });
        },
    },
    viewModel: {
        formulas: {
            title: function (get) {
                return get('moduleTitle') + ' ' + get('viewTitle');
            }
        },
        data: {
            moduleTitle: '',
            moduleIconCls: '',
            viewTitle: '',
            workspaceExpanded: false,
            personnel_description: '',
            backendTaskSize: ''
        },
        stores: {
            backendTasks: {
                data: []
            }
        }
    },
    layout: 'float',
    config: {
        appTitle: '',
        appIconCls: 'psr-desktop-nav-app-icon'
    },
    updateStore: function (store) {
        if (store) {
            store.setSorters('sort');
            if (this.navigationView) {
                this.navigationView.setStore(store);
            }
        }
    },
    onStoreLoad: function (store, records, success) {
        const me = this,
            vm = me.getViewModel(),
            c = me.getController();
        if (c.switchingNodeId) {
            c.switchNode(c.switchingNodeId);
            delete c.switchingNodeId;
        } else {
            Ext.route.Router.onStateChange(Ext.util.History.getToken())
        }
    },
    updateAppTitle: function (value) {
        document.title = value;
    },
    constructor: function (config) {
        const appIconCls = config.appIconCls || this.config.appIconCls,
            appTitle = config.appTitle || this.config.appTitle;
        config.items = [{
            docked: 'left',
            xtype: 'psr-view-desktop-navigation',
            appIconCls: appIconCls,
            appTitle: appTitle,
            hideAnimation: {
                type: 'slide',
                direction: 'left',
                out: true
            },
            showAnimation: {
                type: 'slide',
                direction: 'right',
                out: false
            },
        }, {
            xtype: 'titlebar',
            ui: 'psr-desktop-title',
            height: '64px',
            docked: 'top',
            titleAlign: 'left',
            hideMode: 'clip',
            hideAnimation: {
                type: 'slide',
                direction: 'up',
                out: true
            },
            showAnimation: {
                type: 'slide',
                direction: 'down',
                out: false
            },
            bind: {title: '{title}'},
            defaultButtonUI: 'psr-desktop-title-button',
            items: [{
                align: 'left',
                iconCls: 'x-fa fa-outdent',
                handler: 'hBtnOutdent'
            }, {
                align: 'left',
                iconCls: 'x-fa fa-history',
                handler: 'hBtnBackendTaskList',
                bind: {
                    badgeText: '{backendTaskSize}'
                }
            }, {
                align: 'left',
                iconCls: 'x-fa fa-expand',
                handler: 'hBtnExpand'
            }, {
                xtype: 'button',
                align: 'right',
                iconCls: 'x-fa fa-power-off', iconAlign: 'right',
                handler: 'hBtnLogout',
                bind: {
                    text: '{personnel_description}'
                }
            }]
        }, {
            xtype: 'button', reference: 'btnCompress',
            hidden: true,
            iconCls: 'x-fa fa-compress',
            draggable: true,
            shadow: true,
            left: 5,
            top: 5,
            width: 36,
            height: 36,
            handler: 'hBtnCompress'
        }, {
            xtype: 'psr-view-desktop-workspace',
            width: '100%',
            height: '100%'
        }];
        this.callParent([config]);
        const vm = this.getViewModel();
        this.navigationView = this.down('psr-view-desktop-navigation');
        this.navigationView.setStore(this.getStore());
        this.titleView = this.down('titlebar');
        this.btnCompress = this.down('button[reference="btnCompress"]');
        this.workspaceView = this.down('psr-view-desktop-workspace');
        PSR.view.desktop.Main.loadPersonnel(function (result) {
            if (result) {
                vm.set('personnel_description', result.description);
            } else {
                vm.set('personnel_description', PSR.clientSite.ClientSite.clientToken.username);
            }
        });
    },
    statics: {
        loadPersonnel: function (callback) {
            if (PSR.clientSite.ClientSite.clientToken) {
                PSR.clientSite.Ajax.request({
                    method: 'GET',
                    params: {
                        searchParams: JSON.stringify({userId: [PSR.util.service.Entity.searchParams.include.equal(PSR.clientSite.ClientSite.clientToken.username)]}),
                    },
                    url: window.gatewaySite + '/organization/api/entity/personnel',
                    disableCaching: true,
                    bizSuccess: function (result) {
                        PSR.view.desktop.Main.personnel = result.content[0];
                        if (callback) {
                            callback(result.content[0]);
                        }
                    },
                    on50x: function (response, opt) {
                        PSR.Ajax.on50x(response, opt);
                        if (callback) {
                            callback(null);
                        }
                    }
                });
            } else {
                PSR.clientSite.ClientSite.getClientToken(function () {
                    PSR.view.desktop.Main.loadPersonnel(callback);
                });
            }
        },
        personnel: null
    }
});
