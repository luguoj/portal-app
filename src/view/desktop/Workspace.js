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
                nodeView = v.getComponent(nodeId),
                backendTasks = vm.getStore('backendTasks');
            if (!nodeView) {
                PSR.clientSite.ClientSite.addModuleItem({
                    moduleId: moduleId,
                    config: Object.assign({itemId: nodeId}, viewConfig),
                    parent: v,
                    callback: function (nodeView) {
                        backendTasks.add(node.data);
                        vm.set('backendTaskSize', v.getItems().length - 1);
                        c.switchNode(node);
                    }
                });
            } else {
                v.setActiveItem(nodeView);
                if (nodeView.getViewTitle) {
                    vm.set('viewTitle', nodeView.getViewTitle());
                } else {
                    vm.set('viewTitle', '');
                }
                backendTasks.clearFilter();
                backendTasks.addFilter(
                    function (item) {
                        return item.id != nodeId;
                    }
                );
            }
        },
        exitNode: function (nodes) {
            const c = this,
                v = c.getView(),
                vm = c.getViewModel(),
                backendTasks = vm.getStore('backendTasks');
            if (nodes && nodes.length > 0) {
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const nodeId = node.get('id'),
                        nodeView = v.getComponent(nodeId);
                    if (nodeView) {
                        v.remove(nodeView);
                        backendTasks.remove(backendTasks.findRecord("id", nodeId));
                        vm.set('backendTaskSize', v.getItems().length - 1);
                    }
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
    },
    exitNode: function (node) {
        this.getController().exitNode(node);
    }
});
