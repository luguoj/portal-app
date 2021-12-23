Ext.define('PortalApp.view.portalConsole.group.GroupNavigationItemView', {
    extend: 'Ext.panel.Panel',
    xtype: 'portalconsole-group-groupnavigationitemview',
    config: {
        group: null
    },
    layout: 'fit',
    tbar: {
        items: ['门户:', {
            xtype: 'combobox',
            allowBlank: false,
            emptyText: '选择门户',
            editable: false,
            valueField: 'id',
            displayField: 'description',
            bind: {store: '{portals}'},
            listeners: {
                change: 'onCombPortalChange'
            }
        }, {
            iconCls: 'x-fa fa-redo-alt',
            handler: 'hBtnRefresh',
            bind: {
                disabled: '{!portalId}'
            }
        }]
    },
    items: [{
        xtype: 'treepanel',
        columns: [{
            text: '授权',
            xtype: 'widgetcolumn',
            width: 48,
            resizable: false,
            menuDisabled: true,
            widget: {
                xtype: 'button',
                handler: 'hBtnEnabled',
                bind: {
                    hidden: '{!record.isView}',
                    iconCls: '{record.granted?"x-fa fa-check-circle psr-color-confirm":"x-fa fa-check psr-color-disabled"}'
                }
            }
        }, {
            xtype: 'treecolumn',
            flex: 1,
            text: '标题',
            dataIndex: 'text'
        }],
        bind: {
            store: '{navigationItemTree}',
            disabled: '{!portalId}'
        }
    }],
    updateGroup: function (value) {
        this.getViewModel().set('group', value);
    },
    controller: 'portalconsole-group-groupnavigationitemviewcontroller',
    viewModel: {
        data: {
            group: null,
            portalId: null
        },
        stores: {
            portals: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.PortalEntity',
                autoLoad: true
            },
            navigationItemTree: {
                fields: ['id', 'version', 'portalId', 'parentId', 'isView', 'text', 'iconCls', 'content', 'granted'],
                type: 'entitytree',
                transform: 'parentTree',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.NavigationItemEntity',
                autoLoad: false,
                rootText: '导航节点',
                sorters: [{property: 'sort', direction: 'ASC'}],
                listeners: {
                    load: 'onDataLoad'
                }
            },
            groupNavigationItems: {
                type: 'entity',
                application: 'portal',
                domainType: 'org.psr.platform.portal.entity.GroupNavigationItemEntity',
                autoLoad: false,
                listeners: {
                    load: 'onDataLoad'
                }
            }
        }
    }
});