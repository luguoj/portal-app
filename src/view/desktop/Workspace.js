Ext.define('PSR.view.desktop.workspace', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop-workspace',
    controller: {
        switchNode: function (node) {
            const c = this,
                v = c.getView(),
                nodeId = node.get('id'),
                title = node.get('text'),
                iconCls = node.get('iconCls'),
                moduleId = node.get('moduleId'),
                viewConfig = node.get('viewConfig'),
                nodeView = v.getComponent(nodeId);
            if (!nodeView) {
                PSR.clientSite.ClientSite.addModuleItem(
                    moduleId,
                    Object.assign({itemId: nodeId}, viewConfig),
                    v,
                    function (item) {
                        v.setActiveItem(item);
                    });
            } else {
                v.setActiveItem(nodeView);
            }
        }
    },
    layout: {
        type: 'card',
        animation: 'fade'
    },
    items: [],
    switchNode: function (node) {
        this.getController().switchNode(node);
    }
});
