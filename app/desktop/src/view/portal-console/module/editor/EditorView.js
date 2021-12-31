Ext.define('PortalApp.view.portalConsole.module.EditorView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-module-editorview',
    controller: 'portalconsole-module-editorviewcontroller',
    config: {
        module: null
    },
    layout: {type: 'vbox', align: 'stretch'},
    scrollable: 'y',
    bodyPadding: 10,
    defaults: {
        frame: true,
        ui: 'light',
        titleCollapse: true,
        collapsible: true,
        collapseFirst: false,
        margin: '0 0 10 0'
    },
    items: [{
        reference: 'viewProperty',
        xtype: 'portalconsole-module-editor-propertyview',
        title: '属性',
        listeners: {
            save: 'onModuleLoad',
            reset: 'reloadModule'
        }
    }, {
        reference: 'viewSourceFile',
        xtype: 'portalconsole-module-editor-sourcefileview',
        title: '源码',
        listeners: {
            save: 'onModuleLoad'
        }
    }, {
        reference: 'viewAction',
        xtype: 'portalconsole-module-editor-actionview',
        title: '操作'
    }, {
        reference: 'viewResourceFile',
        xtype: 'portalconsole-module-editor-resourcefileview',
        title: '资源',
    }],
    bind: {
        title: '模块:{module.description}'
    },
    updateModule: function (value) {
        const viewModel = this.getViewModel(),
            controller = this.getController();
        viewModel.set('module', value);
        if (this.rendered) {
            controller.loadData();
        }
    },
    viewModel: {
        data: {
            module: null
        }
    }
});
