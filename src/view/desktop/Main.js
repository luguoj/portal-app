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
                vm = this.getViewModel(),
                nodes = v.getStore(),
                targetNode = nodes.isTreeStore ?
                    nodes.findNode('id', nodeId) : nodes.findRecord('id', nodeId);
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
            PSR.clientSite.ClientSite.logout();
        },
    },
    viewModel: {
        formulas: {
            title: function (get) {
                return get('moduleTitle') + '\\' + get('viewTitle');
            }
        },
        data: {
            moduleTitle: '',
            moduleIconCls: '',
            viewTitle: '',
            workspaceExpanded: false
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
        var token = Ext.util.History.getToken();
        Ext.route.Router.onStateChange(token);
    },
    updateAppTitle: function (value) {
        document.title = value;
    },
    constructor: function (config) {
        this.callParent([config]);
        this.navigationView = this.add(this.createNavigationView());
        this.titleView = this.add({
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
                iconCls: 'x-fa fa-expand',
                handler: 'hBtnExpand'
            }, {
                xtype: 'button',
                align: 'right',
                iconCls: 'x-fa fa-power-off',
                handler: 'hBtnLogout'
            }]
        });
        this.btnCompress = this.add({
            xtype: 'button',
            hidden: true,
            iconCls: 'x-fa fa-compress',
            draggable: true,
            shadow: true,
            left: 5,
            top: 5,
            width: 36,
            height: 36,
            handler: 'hBtnCompress'
        });
        this.workspaceView = this.add(this.createWorkspaceView());
    },
    createNavigationView: function (me, config) {
        return {
            docked: 'left',
            xtype: 'psr-view-desktop-navigation',
            appIconCls: this.getAppIconCls(),
            appTitle: this.getAppTitle(),
            store: this.getStore(),
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
        };
    },
    createWorkspaceView: function (me, config) {
        return {
            xtype: 'psr-view-desktop-workspace',
            width: '100%',
            height: '100%'
        };
    }
});
