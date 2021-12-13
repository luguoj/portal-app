Ext.onReady(function () {

});

Ext.define('PSR-Ext.locale.zh_CN.view.AbstractView', {
    override: 'Ext.view.AbstractView',
    loadingText: '读取中...'
});
Ext.define('PSR-Ext.locale.zh_CN.grid.column.Boolean', {
    override: 'Ext.grid.column.Boolean',
    trueText: '是',
    falseText: '否'
});

Ext.define('PSR-Ext.locale.zh_CN.grid.filters.Filters', {
    override: 'Ext.grid.filters.Filters',
    menuFilterText: '过滤'
});

Ext.define('PSR-Ext.locale.zh_CN.grid.filters.filter.Boolean', {
    override: 'Ext.grid.filters.filter.Boolean',
    yesText: '是',
    noText: '否'
});
Ext.define('PSR-Ext.locale.zh_CN.grid.filters.filter.Date', {
    override: 'Ext.grid.filters.filter.Date',
    config: {
        fields: {
            lt: {text: '之前'},
            gt: {text: '之后'},
            eq: {text: '在'}
        }
    }
});
Ext.define('PSR-Ext.locale.zh_CN.grid.filters.filter.Number', {
    override: 'Ext.grid.filters.filter.Number',
    emptyText: '输入数字...'
});
Ext.define('PSR-Ext.locale.zh_CN.grid.filters.filter.String', {
    override: 'Ext.grid.filters.filter.String',
    emptyText: '输入文本...'
});
