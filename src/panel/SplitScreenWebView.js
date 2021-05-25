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
                cmpConfig = {
                    xtype: 'container',
                    layout: {type: 'card', animation: 'fade'},
                    items: []
                };
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
                    iconCls: 'x-fa fa-caret-up p-color-base-0_3-important',
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
                            button.setIconCls('x-fa fa-caret-up p-color-base-0_3-important');
                            subContainer.subViewMaximized = false;
                        } else {
                            subContainer.setLeft(0);
                            subContainer.setTop(0);
                            subContainer.setWidth('100%');
                            subContainer.setHeight('100%');
                            button.setIconCls('x-fa fa-caret-down p-color-base-0_3-important');
                            subContainer.subViewMaximized = true;
                        }
                    }
                }, {
                    xtype: 'button',
                    tooltip: '重置', iconCls: 'x-fa fa-undo p-color-base-0_3-important',
                    right: 36,
                    top: 0,
                    width: 36,
                    height: 36,
                    handler: function (button) {
                        const subContainer = button.up('container'),
                            cmpContainer = subContainer.getAt(0);
                        cmpContainer.getActiveItem().refresh();
                    }
                }]
            });
            if (subScreen.urls) {
                if (subScreen.urls.length > 1) {
                    cmpConfig.afterRender = function () {
                        Ext.interval(function () {
                            if (this.getActiveItemIndex() == this.items.length - 1) {
                                this.setActiveItem(0);
                            } else {
                                this.setActiveItem(this.getActiveItemIndex() + 1);
                            }
                        }, subScreen.interval ? subScreen.interval : 2000, this)
                    };
                }
                for (let j = 0; j < subScreen.urls.length; j++) {
                    const url = subScreen.urls[j];
                    cmpConfig.items.push({xtype: 'psr-iframe', src: url});
                }
            } else if (subScreen.cmpConfig) {
                Object.assign(cmpConfig, subScreen.cmpConfig);
            }
        }
        me.callParent([config]);
    }
});
