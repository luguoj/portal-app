Ext.define('PSR.view.desktop.workspace', {
    extend: 'Ext.Container',
    xtype: 'psr-view-desktop-workspace',
    controller: {
        switchNode: function (node) {
            const c = this,
                v = c.getView(),
                vm = c.getViewModel(),
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
                    function (nodeView) {
                        v.setActiveItem(nodeView);
                        if (nodeView.topView) {
                            vm.set('viewTitle', nodeView.topView.title);
                        }
                    });
            } else {
                v.setActiveItem(nodeView);
                if (nodeView.topView) {
                    vm.set('viewTitle', nodeView.topView.title);
                }
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
