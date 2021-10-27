Ext.define('PortalApp.view.main.WorkspaceViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-workspaceviewcontroller',
    switchView: function (opt) {
        const c = this,
            v = c.getView(),
            vm = c.getViewModel(),
            viewId = 'workview-' + opt.viewId,
            title = opt.title,
            iconCls = opt.iconCls,
            moduleId = opt.moduleId,
            viewConfig = opt.viewConfig,
            view = v.getComponent(viewId);
        if (!view) {
            const newViewConfig = Object.assign(
                {
                    itemId: viewId,
                    title: title,
                    iconCls: iconCls
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
                            item.addListener('switchview', c.switchView)
                            c.switchView(opt);
                        } catch (e) {
                            PSR.util.Message.error('创建模块失败')
                        }
                    }
                });
            } else {
                const item = Ext.create(newViewConfig);
                v.add(item);
                item.addListener('switchview', c.switchView);
                c.switchView(opt);
            }
        } else {
            v.setActiveItem(view);
        }
    }
});
