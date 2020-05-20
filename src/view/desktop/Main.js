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
        hBtnResize: function () {
            var v = this.getView();
            v.navigationView.toggleMicro();
        },
        hBtnLogout: function () {
            PSR.clientSite.ClientSite.logout();
        },
    },
    viewModel: {
        data: {
            moduleTitle: '',
            moduleIconCls: ''
        }
    },
    layout: 'card',
    config: {
        appTitle: '',
        appIconCls: 'psr-desktop-nav-app-icon'
    },
    updateStore: function (store) {
        if (store) {
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
            bind: {title: '{moduleTitle}'},
            defaultButtonUI: 'psr-desktop-title-button',
            items: [{
                align: 'left',
                bind: {iconCls: '{moduleIconCls}'},
                handler: 'hBtnResize'
            },{
                xtype: 'button',
                align: 'right',
                iconCls: 'x-fa fa-power-off',
                handler: 'hBtnLogout'
            }]
        });
        this.workspaceView = this.add(this.createWorkspaceView());
    },
    createNavigationView: function (me, config) {
        return {
            docked: 'left',
            xtype: 'psr-view-desktop-navigation',
            appIconCls: this.getAppIconCls(),
            appTitle: this.getAppTitle(),
            store: this.getStore()
        };
    },
    createWorkspaceView: function (me, config) {
        return {
            xtype: 'psr-view-desktop-workspace'
        };
    }
});
