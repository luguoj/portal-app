Ext.define('PortalApp.view.main.MainView', {
    extend: 'Ext.container.Container',
    xtype: 'mainview',
    controller: 'mainviewcontroller',
    viewModel: {
        type: 'mainviewmodel'
    },
    layout: 'border',
    items: [{
        region: 'west',
        docked: 'left',
        width: '30%',
        split: true,
        collapsible: true,
        xtype: 'main-navigationview',
        hideAnimation: {
            type: 'slide',
            direction: 'left',
            out: true
        },
        showAnimation: {
            type: 'slide',
            direction: 'right',
            out: false
        },
        bind: {store: '{navNodes}', title: '{appTitle}'}
    }, {
        region: 'center',
        layout: 'border',
        items: [{
            region: 'north',
            docked: 'top',
            height: 50,
            xtype: 'toolbar',
            ui: 'portal-main-toolbar',
            hideMode: 'clip',
            hideAnimation: {
                type: 'slide',
                direction: 'up',
                out: true
            },
            showAnimation: {
                type: 'slide',
                direction: 'down',
                out: false
            },
            defaultButtonUI: 'portal-main-toolbar-button-toolbar',
            items: [{
                iconCls: 'x-fa fa-expand', tooltip: '全屏',
                handler: 'hBtnFullscreen'
            }, '->', {
                iconCls: 'x-fa fa-power-off', iconAlign: 'right',
                handler: 'hBtnLogout',
                bind: {
                    text: '{personnel_description}'
                }
            }]
        }, {
            region: 'center',
            xtype: 'main-workspaceview',
            width: '100%',
            height: '100%'
        }]
    }, {
        xtype: 'button', reference: 'btnExitFullscreen',
        hidden: true,
        floating: true,
        iconCls: 'x-fa fa-compress', tooltip: '退出全屏',
        shadow: true,
        x: -30,
        y: 7,
        width: 36,
        height: 36,
        handler: 'hBtnExitFullscreen',
        listeners: {
            mouseover: function (button) {
                button.outside = true;
                button.animate({
                    to: {
                        x: 1
                    }
                });
            },
            mouseout: function (button) {
                button.outside = false;
                setTimeout(function () {
                    if (button.outside == false) {
                        button.animate({
                            to: {
                                x: -30
                            }
                        });
                    }
                }, 1000);
            }
        }
    }]
});