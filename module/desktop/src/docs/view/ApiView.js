Ext.define('PSR.view.docs.ApiView', {
    extend: 'Ext.panel.Panel',
    xtype: 'psr-view-docs-apiview',
    layout: 'fit',
    items: [{
        xtype: 'psr-iframe',
        src: window.portalEnv.gateway + '/swagger-ui.html'
    }]
});