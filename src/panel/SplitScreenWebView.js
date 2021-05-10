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
            subScreen.left = subScreen.left ? subScreen.left : 0;
            subScreen.top = subScreen.top ? subScreen.top : 0;
            subScreen.width = subScreen.width ? subScreen.width : '100%';
            subScreen.height = subScreen.height ? subScreen.height : '100%';
            items.push({
                xtype: 'container',
                layout: 'fit',
                left: subScreen.left,
                top: subScreen.top,
                width: subScreen.width,
                height: subScreen.height,
                items: [cmpConfig, {
                    xtype: 'button',
                    iconCls: 'x-fa fa-caret-up',
                    right: 0,
                    top: 0,
                    width: 36,
                    height: 36,
                    handler: function (button) {
                        const subContainer = button.up('container');
                        for (const item of me.items.items) {
                            if (item != subContainer) {
                                if (subContainer.subViewMaximized) {
                                    item.show();
                                } else {
                                    item.hide();
                                }
                            }
                        }
                        if (subContainer.subViewMaximized) {
                            subContainer.setLeft(subScreen.left);
                            subContainer.setTop(subScreen.top);
                            subContainer.setWidth(subScreen.width);
                            subContainer.setHeight(subScreen.height);
                            button.setIconCls('x-fa fa-caret-up');
                            subContainer.subViewMaximized = false;
                        } else {
                            subContainer.setLeft(0);
                            subContainer.setTop(0);
                            subContainer.setWidth('100%');
                            subContainer.setHeight('100%');
                            button.setIconCls('x-fa fa-caret-down');
                            subContainer.subViewMaximized = true;
                        }
                    }
                }]
            });
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
                    cmpConfig.layout = 'fit';
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
