Ext.define('PortalApp.view.main.MainView', {
    extend: 'Ext.container.Container',
    xtype: 'mainview',
    controller: 'mainviewcontroller',
    viewModel: {
        type: 'mainviewmodel'
    },
    config: {
        appTitle: ''
    },
    updateAppTitle: function (value) {
        this.getViewModel().set('appTitle', value);
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
        xtype: 'button', reference: 'btnExitFullscreen',
        hidden: true,
        iconCls: 'x-fa fa-compress', tooltip: '退出全屏',
        draggable: true,
        shadow: true,
        left: 5,
        top: 5,
        width: 36,
        height: 36,
        handler: 'hBtnExitFullscreen'
    }, {
        region: 'center',
        layout: 'border',
        items: [{
            region: 'north',
            docked: 'top',
            height: 50,
            xtype: 'toolbar',
            ui: 'psr-desktop-title',
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
            defaultButtonUI: 'psr-desktop-title-button-toolbar',
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
    }]
});