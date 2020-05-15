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
                nodes = v.getStore(),
                targetNode = nodes.isTreeStore ?
                    nodes.findNode('id', nodeId) : nodes.findRecord('id', nodeId);
            if (targetNode == null) {
                console.log('unmatchedRoute: ' + nodeId);
                return;
            }
            v.workspaceView.switchNode(targetNode);
            v.navigationView.switchNode(targetNode);
        }
    },
    viewModel: {},
    layout: 'card',
    config: {
        appTitle: '',
        appIconCls: ''
    },
    updateStore: function (store) {
        if (store) {
            store.load();
            if (this.navigationView) {
                this.navigationView.setStore(store);
            }
        }
    },
    onStoreLoad: function (store, records, success) {
        var v = this,
            nodes = [],
            token = Ext.util.History.getToken();
        if (records) {
            for (let i = 0; i < records.length; i++) {
                nodes.push(records[i].data);
            }
        }
        Ext.route.Router.onStateChange(token);
    },
    updateAppTitle: function (value) {
        document.title = value;
    },
    constructor: function (config) {
        this.callParent([config]);
        this.navigationView = this.add(this.createNavigationView());
        this.workspaceView = this.add(this.createWorkspaceView());
    },
    createNavigationView: function (me, config) {
        return {
            docked: 'left',
            xtype: 'psr-view-desktop-navigation',
            border: true,
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
