Ext.define('PSR.panel.SplitScreenWebView', {
    xtype: 'psr-panel-splitscreenwebview',
    extend: 'Ext.Container',
    layout: 'float',
    config: {
        subScreens: []
    },
    constructor: function (config) {
        const me = this,
            subScreens = [].concat(config.subScreens || this.config.subScreens || []),
            items = [].concat(config.items || this.config.items || []);
        config.items = items;
        for (let i = 0; i < subScreens.length; i++) {
            const subScreen = subScreens[i],
                cmpConfig = {items: []};
            items.push(cmpConfig);
            cmpConfig.left = subScreen.left;
            cmpConfig.right = subScreen.right;
            cmpConfig.width = subScreen.width;
            cmpConfig.height = subScreen.height;
            if (subScreen.urls) {
                if (subScreen.urls.length > 1) {
                    cmpConfig.xtype = 'carousel';
                    cmpConfig.afterRender = function () {
                        Ext.interval(function () {
                            if (this.getActiveIndex() == this.items.length - 2) {
                                this.setActiveItem(0);
                            } else {
                                this.next();
                            }
                        }, subScreen.interval ? subScreen.interval : 2000, this)
                    };
                } else {
                    cmpConfig.xtype = 'container';
                }
                for (let j = 0; j < subScreen.urls.length; j++) {
                    const url = subScreen.urls[j];
                    cmpConfig.items.push({xtype: 'psr-iframe', src: url});
                }
            }
        }
        me.callParent([config]);
    }
});
