Ext.define('PortalApp.view.docs.ExtjsView', {
    extend: 'Ext.panel.Panel',
    xtype: 'docs-extjsview',
    layout: 'fit',
    items: [{
        xtype: 'psr-iframe',
        src: window.portalEnv.portal + '/docs/sencha/extjs/7.4.0/'
    }]
});