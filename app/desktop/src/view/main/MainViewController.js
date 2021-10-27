Ext.define('PortalApp.view.main.MainViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.mainviewcontroller',
    routes: {
        ':nodeId': {action: 'mainRoute'}
    },
    mainRoute: function (nodeId) {
        var v = this.getView(),
            vm = this.getViewModel(),
            nodes = vm.getStore('navNodes');
        if (nodes.isLoaded()) {
            this.switchNode(nodeId);
        } else {
            this.switchingNodeId = nodeId;
        }
    },
    switchNode: function (nodeId) {
        var v = this.getView(),
            workspaceView = v.down('main-workspaceview'),
            navigationView = v.down('main-navigationview'),
            vm = this.getViewModel(),
            nodes = vm.getStore('navNodes'),
            targetNode;
        targetNode = nodes.isTreeStore
            ? nodes.findNode('id', nodeId)
            : nodes.findRecord('id', nodeId);
        if (targetNode == null) {
            console.log('unmatchedRoute: ' + nodeId);
            return;
        }
        workspaceView.switchView({
            viewId: targetNode.get('id'),
            title: targetNode.get('text'),
            iconCls: targetNode.get('iconCls'),
            moduleId: targetNode.get('moduleId'),
            viewConfig: targetNode.get('viewConfig')
        });
        navigationView.switchNode({
            nodeId: targetNode.get('id')
        });
    },
});
