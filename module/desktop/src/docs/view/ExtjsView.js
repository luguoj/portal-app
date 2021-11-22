Ext.define('PSR.view.docs.ExtjsView', {
    extend: 'Ext.panel.Panel',
    xtype: 'psr-view-docs-extjsview',
    layout: 'fit',
    items: [{
        xtype: 'psr-iframe',
        src: window.portalEnv.portal + '/docs/sencha/extjs/7.4.0/'
    }]
});