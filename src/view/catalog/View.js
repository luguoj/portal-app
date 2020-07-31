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
        getService: undefined
    },
    subViewConfigs: {
        main: {
            xtype: 'psr-catalog-list',
            listeners: {
                goDetails: 'goDetails',
                goUsers: 'goUsers',
                goClients: 'goClients'
            },
        },
        details: {
            xtype: 'psr-catalog-details'
        },
    }
});
