Ext.define('PSR.view.desktop.workspace', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop-workspace',
    controller: {
        switchModule:function (module) {
            var v = this.getView();
            var moduleId = module.get('id');
            var moduleView = v.getComponent(moduleId);
            if (!moduleView) {
                var xtype = module.get('xtype');
                var exists = Ext.ClassManager.getByAlias('widget.' + xtype);
                if (exists === undefined) {
                    console.log(moduleId + ' does not exist');
                    return false;
                }
                moduleView = v.add({
                    xtype: xtype,
                    itemId: moduleId,
                    title: module.get('description'),
                    iconCls: module.get('iconCls')
                });
            }
            v.setActiveItem(moduleView);
            return true;
        }
    },
    layout: 'card',
    items: [],
    switchModule: function (module) {
        return this.getController().switchModule(module);
    }
});
