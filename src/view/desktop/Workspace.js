Ext.define('PSR.view.desktop.workspace', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop-workspace',
    controller: {
        switchNode: function (node) {
            var v = this.getView(),
                nodeId = node.get('id'),
                title = node.get('text'),
                iconCls = node.get('iconCls'),
                viewConfig = node.get('viewConfig'),
                nodeView = v.getComponent(nodeId);
            if (!nodeView) {
                nodeView = v.add(Object.assign({
                    itemId: nodeId,
                    layout: 'fit',
                    items: [viewConfig]
                }));
            }
            v.setActiveItem(nodeView);
            return true;
        }
    },
    layout: 'card',
    items: [],
    switchNode: function (node) {
        return this.getController().switchNode(node);
    }
});
