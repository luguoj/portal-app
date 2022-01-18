Ext.define('PortalApp.component.ModuleComponent', {
    extend: 'Ext.container.Container',
    xtype: 'portalapp-modulecomponent',
    config: {
        moduleId: null,
        componentTpl: null
    },
    layout: 'fit',
    afterRender: function () {
        this.callParent();
        this.initComponentItem();
    },
    updateModuleId: function (value) {
        if (this.rendered) {
            this.initComponentItem();
        }
    },
    updateComponentTpl: function (value) {
        if (this.rendered) {
            this.initComponentItem();
        }
    },
    getComponentItem: function () {
        if (this.items && this.items.length > 0) {
            return this.items.items[0];
        }
    },
    initComponentItem: function () {
        const me = this,
            moduleId = this.getModuleId();
        if (moduleId) {
            this.fireEvent('loadmodule', {
                moduleId: this.getModuleId(),
                success: function () {
                    me.createComponentItem();
                },
                failure: function () {
                    me.add({
                        layout: 'center',
                        items: [{html: '模块加载失败'}]
                    });
                }
            });
        } else {
            me.createComponentItem();
        }
    },
    createComponentItem: function () {
        const componentTpl = this.getComponentTpl();
        this.removeAll();
        if (componentTpl) {
            try {
                this.add(Ext.create(componentTpl));
            } catch (e) {
                this.add({
                    layout: 'center',
                    items: [{html: e.message}]
                });
            }
        }
    }
});