Ext.define('PortalApp.view.main.WorkspaceViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-workspaceviewcontroller',
    switchView: function (opt) {
        const me = this,
            view = me.getView(),
            viewModel = me.getViewModel(),
            viewId = opt.viewId,
            tabView = view.getComponent(viewId);
        if (!tabView) {
            const moduleId = opt.moduleId;
            if (moduleId) {
                PortalApp.util.Module.load({
                    moduleId: moduleId,
                    success: function (module) {
                        if (module.actions) {
                            for (let i = 0; i < module.actions.length; i++) {
                                viewModel.set('module-action-' + moduleId + '-' + module.actions[i], true);
                            }
                        }
                        me.createTabView(opt);
                    },
                    failure: function () {
                        me.refreshToken();
                    }
                });
            } else {
                me.createTabView(opt);
            }
        } else {
            view.setActiveItem(tabView);
        }
    },
    createTabView: function (opt) {
        const me = this,
            view = this.getView();
        if (!opt.viewConfig) {
            console.error(new Error("视图创建失败,viewConfig为空"));
            return;
        }
        const newViewConfig = Object.assign(
            {
                itemId: opt.viewId,
                title: opt.title ? opt.title : '未命名',
                iconCls: opt.iconCls ? opt.iconCls : 'x-fa fa-exclamation-triangle'
            },
            opt.viewConfig
        );
        try {
            const item = Ext.create(newViewConfig);
            view.add(item);
            item.addListener('switchview', function (opt) {
                me.switchView(opt);
            });
            me.switchView(opt);
        } catch (e) {
            console.error(e);
        }
    },
    onTabChange: function () {
        this.refreshToken();
    },
    onTabRemove: function () {
        this.refreshToken();
    },
    refreshToken: function () {
        const activateTab = this.getView().getActiveTab();
        if (activateTab) {
            this.redirectTo(window.btoa(activateTab.getItemId()).replaceAll('=', ''));
        } else {
            this.redirectTo('');
        }
    }
});
