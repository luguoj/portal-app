/**
 * @description 目录主数据管理视图
 * <p>需实现函数配置getService,返回服务类对象</p>
 * <p>需实现store类型catalogtree,目录树</p>
 * <p>需实现store类型catalogusage,用途</p>
 * @author ZHOUDD
 * @date 2020/7/23
 */
Ext.define('PSR.view.catalog.View', {
    extend: 'PSR.view.work.View',
    xtype: 'psr-catalog',
    config: {
        catalogStore: null,
        catalogUsageStore: null,
        catalogService: undefined
    },
    controller: {
        goDetails: function (opt) {
            this.goSubView('details', {record: opt.selection});
        },
        create: function (opt) {
            this.goSubView('details');
        }
    },
    constructor: function (config) {
        this.subViewConfigs = config.subViewConfigs || {
            main: {
                xtype: 'psr-catalog-list',
                listeners: {
                    goDetails: 'goDetails',
                    create: 'create'
                },
                catalogStore: config.catalogStore || this.config.catalogStore,
                catalogService: config.catalogService || this.config.catalogService
            },
            details: {
                xtype: 'psr-catalog-details',
                catalogUsageStore: config.catalogUsageStore || this.config.catalogUsageStore,
                catalogService: config.catalogService || this.config.catalogService
            },
        };
        this.callParent([config]);
    }
});
