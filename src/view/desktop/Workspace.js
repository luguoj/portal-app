Ext.define('PSR.view.desktop.workspace', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop-workspace',
    controller: {
        switchNode: function (node) {
            var c = this,
                v = c.getView(),
                nodeId = node.get('id'),
                title = node.get('text'),
                iconCls = node.get('iconCls'),
                moduleId = node.get('moduleId'),
                viewConfig = node.get('viewConfig'),
                nodeView = v.getComponent(nodeId);
            if (!nodeView) {
                var moduleReady = true;
                if (moduleId) {
                    moduleReady = PSR.clientSite.ClientSite.getModuleReady(moduleId, function () {
                        c.switchNode(node);
                    });
                    if (!moduleReady) {
                        return false;
                    }
                }
                if (moduleReady) {
                    nodeView = v.add(Object.assign({
                        itemId: nodeId,
                        layout: 'fit',
                        items: [viewConfig]
                    }));
                }
            }
            v.setActiveItem(nodeView);
            return true;
        }
    },
    layout: {
        type: 'card',
        animation: 'fade'
    },
    items: [],
    switchNode: function (node) {
        return this.getController().switchNode(node);
    }
});
