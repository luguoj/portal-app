Ext.define('PortalApp.view.docs.ApiView', {
    extend: 'Ext.panel.Panel',
    xtype: 'docs-apiview',
    layout: 'fit',
    items: [{
        xtype: 'psr-iframe',
        src: window.portalEnv.gateway + '/swagger-ui.html'
    }]
});