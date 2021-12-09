Ext.define('PortalApp.view.main.NavigationViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main-navigationviewcontroller',
    onMenuItemClick: function (tree, event) {
        if (event.node.isLeaf() && event.node.data.viewConfig) {
            this.redirectTo(window.btoa(event.node.get('id')).replaceAll('=', ''));
        }
    },
    switchNode: function (opt) {
        var v = this.getView(),
            navigationNodes = v.getStore(),
            navigationNode = navigationNodes ? navigationNodes.findNode("id", opt.nodeId) : null;
        if (navigationNode) {
            v.navTree.setSelection(navigationNode);
        } else {
            v.navTree.setSelection(null);
        }
    }
});
