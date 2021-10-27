Ext.define('PortalApp.view.main.NavigationViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-navigationviewcontroller',
    onMenuItemClick: function (tree, event) {
        if (event.node.isLeaf() && event.node.data.viewConfig) {
            this.redirectTo(event.node.get('id'));
        }
    },
    switchNode: function (opt) {
        var v = this.getView(),
            navigationNodes = v.getStore(),
            navigationNode = navigationNodes.findNode("id", opt.nodeId);
        if (navigationNode) {
            v.navTree.setSelection(navigationNode);
        }
    }
});
