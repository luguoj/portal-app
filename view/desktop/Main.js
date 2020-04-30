Ext.define('PSR.view.desktop.Main', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop',
    mixins: ['PSR.mixin.Storable'],
    controller: {
        routes: {
            ':moduleId': {action: 'mainRoute'}
        },
        mainRoute: function (moduleId) {
            var v = this.getView(),
                modules = v.getStore(),
                targetModule = modules.findRecord('id', moduleId);
            if (targetModule == null) {
                console.log('unmatchedRoute: ' + moduleId);
                return;
            }
            v.workspaceView.switchModule(targetModule);
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
        }
    },
    onStoreLoad: function (store, records, success) {
        var v = this,
            modules = [],
            token = Ext.util.History.getToken();
        if (records) {
            for (let i = 0; i < records.length; i++) {
                modules.push(records[i].data);
            }
        }
        v.navigationView.initMenu(modules);
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
            appTitle: this.getAppTitle()
        };
    },
    createWorkspaceView: function (me, config) {
        return {
            xtype: 'psr-view-desktop-workspace'
        };
    }
});
