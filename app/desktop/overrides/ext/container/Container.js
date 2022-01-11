Ext.define('PortalApp.overrides.Ext.container.Container', {
    override: 'Ext.container.Container',
    bubbleEvents: ['switchview', 'resetview', 'popupview']
});
