Ext.define('PortalApp.view.dashboard.PartView', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard-partview',
    config: {
        partId: '',
        editing: false,
        splitting: false,
        partLayout: 'vbox',
        content: null,
        parts: []
    },
    items: [{
        flex: 1,
        xtype: 'container',
        layout: 'absolute',
        reference: 'ctBody',
        items: [{
            reference: 'ctContent',
            xtype: 'container',
            anchor: '100% 100%',
            layout: 'fit',
            bind: {
                hidden: '{split}'
            }
        }, {
            reference: 'ctControl',
            xtype: 'container',
            anchor: '100% 100%',
            layout: {type: 'vbox', align: 'stretch'},
            items: [{
                height: 32,
                xtype: 'container',
                layout: {type: 'hbox', align: 'stretch'},
                items: [{
                    width: 32, height: 32,
                    xtype: 'button',
                    iconCls: 'x-fa fa-times',
                    tooltip: '删除',
                    style: {
                        'background-color': null
                    },
                    border: 1,
                    handler: 'hBtnRemove'
                }, {
                    flex: 1,
                    xtype: 'container',
                    cls: 'board-dd-handle',
                    padding: 8,
                    style: {
                        '-webkit-user-select': 'none',
                        '-moz-user-select': 'none',
                        '-ms-user-select': 'none',
                        'user-select': 'none',
                        'background-color': 'rgba(0, 0, 0, 0.2)'
                    },
                    bodyStyle: {
                        'background-color': 'rgba(0, 0, 0, 0.2)',
                        'color': 'white'
                    },
                    bind: {
                        html: '&nbsp{partId}'
                    }
                }]
            }, {
                flex: 1,
                xtype: 'button',
                iconCls: 'x-fa fa-cog',
                tooltip: '配置',
                style: {
                    'background-color': null
                },
                border: 1,
                handler: 'hBtnConfig'
            }],
            bind: {
                hidden: '{!editing||split}'
            }
        }],
    }, {
        xtype: 'button',
        iconCls: 'x-fa fa-plus',
        style: {
            'background-color': null
        },
        border: 1,
        handler: 'hBtnAdd',
        bind: {
            hidden: '{!editing||!splitting}'
        }
    }],
    updateEditing: function (value) {
        this.getViewModel().set('editing', value);
        const ctParts = this.lookup('ctParts'),
            parts = (ctParts && ctParts.items && ctParts.items.items) ? ctParts.items.items : null;
        if (parts && parts.length > 0) {
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (part.setEditing) {
                    part.setEditing(value);
                } else {
                    part.setDisabled(!value);
                }
            }
        }
    },
    updateSplitting: function (value) {
        this.getViewModel().set('splitting', value);
        const ctParts = this.lookup('ctParts'),
            parts = (ctParts && ctParts.items && ctParts.items.items) ? ctParts.items.items : null;
        if (parts && parts.length > 0) {
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                if (part.setSplitting) {
                    part.setSplitting(value);
                }
            }
        }
    },
    updatePartId: function (value) {
        this.getViewModel().set('partId', value);
        this.getController().updatePartId(value);
    },
    updateContent: function () {
        this.getController().loadData();
    },
    updateParts: function (value) {
        this.getController().loadData();
    },
    constructor: function (config) {
        if (config.layout = {type: config.partLayout ? config.partLayout : 'vbox', align: 'stretch'}) ;
        this.callParent([config]);
    },
    genTemplate: function () {
        return this.getController().genTemplate();
    },
    controller: 'dashboard-partviewcontroller',
    viewModel: {
        data: {
            partId: '',
            editing: false,
            splitting: false,
            split: false,
        },
        stores: {}
    }
});