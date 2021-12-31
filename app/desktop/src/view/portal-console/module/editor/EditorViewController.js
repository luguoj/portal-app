Ext.define('PortalApp.view.portalConsole.module.EditorViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portalconsole-module-editorviewcontroller',
    afterRender: function (view) {
        if (view.getModule()) {
            this.loadData();
        }
    },
    loadData: function () {
        const me = this,
            viewModel = this.getViewModel(),
            module = viewModel.get('module');
        if (module && module.get('id') != 'new') {
            PortalApp.data.api.entity.EntityCRUDApi.findAllById({
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.ModuleEntity',
                ids: [module.get('id')],
                success: function (data) {
                    if (data && data.length > 0) {
                        me.onModuleLoad(data[0]);
                    }
                }
            });
            return;
        } else if (module == null) {
            me.onModuleLoad({id: 'new', description: '新模块'});
        }
    },
    onModuleLoad: function (data) {
        const view = this.getView(),
            viewModel = this.getViewModel(),
            module = viewModel.get('module'),
            newModule = Ext.data.Model.loadData(data);
        if (!module || data.id != module.get('id')) {
            view.fireEvent('switchview', {
                viewId: 'portalconsole-module-editorview-' + data.id,
                title: '模块',
                iconCls: 'x-fa fa-edit',
                viewConfig: {
                    xtype: 'portalconsole-module-editorview',
                    module: newModule
                },
            });
            view.close();
        } else {
            viewModel.set('module', newModule);
            this.afterModuleLoad();
        }
    },
    afterModuleLoad: function () {
        const me = this,
            viewModel = this.getViewModel(),
            viewProperty = this.lookup('viewProperty'),
            viewAction = this.lookup('viewAction'),
            viewSourceFile = this.lookup('viewSourceFile'),
            viewResourceFile = this.lookup('viewResourceFile'),
            module = viewModel.get('module');
        viewProperty.setModule(module);
        viewAction.setModule(module);
        viewSourceFile.setModule(module);
        viewResourceFile.setModule(module);
    }
});
