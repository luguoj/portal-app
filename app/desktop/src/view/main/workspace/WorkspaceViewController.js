Ext.define('PortalApp.view.main.WorkspaceViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-workspaceviewcontroller',
    switchView: function (opt) {
        const c = this,
            v = c.getView(),
            viewId = opt.viewId,
            view = v.getComponent(viewId);
        if (!view && opt.viewConfig) {
            const title = opt.title,
                iconCls = opt.iconCls,
                moduleId = opt.moduleId,
                viewConfig = opt.viewConfig;
            const newViewConfig = Object.assign(
                {
                    itemId: viewId,
                    title: title ? title : '未命名',
                    iconCls: iconCls ? iconCls : 'x-fa fa-exclamation-triangle'
                },
                viewConfig
            );
            if (moduleId) {
                PSR.util.Module.load({
                    moduleId: moduleId,
                    callback: function (module) {
                        try {
                            const item = Ext.create(Object.assign({}, newViewConfig, {actions: actions}))
                            v.add(item);
                            item.addListener('switchview', function (opt) {
                                c.switchView(opt);
                            });
                            c.switchView(opt);
                        } catch (e) {
                            PSR.util.Message.error('创建模块失败')
                        }
                    }
                });
            } else {
                const item = Ext.create(newViewConfig);
                v.add(item);
                item.addListener('switchview', function (opt) {
                    c.switchView(opt);
                });
                c.switchView(opt);
            }
        } else {
            v.setActiveItem(view);
        }
    },
    onTabChange: function (tabPanel, newCard) {
        this.redirectTo(window.btoa(newCard.getItemId()).replaceAll('=', ''));
    }
});
