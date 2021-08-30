Ext.define('PSR.Chart', {
    xtype: 'psr-chart',
    extend: 'Ext.Container',
    layout: 'fit',
    items: [{xtype: 'component'}],
    createChart: function (type, options) {
        const chartBoxId = this.getAt(0).element.dom.id;
        if (type != 'chart'
            && type != 'stockChart'
            && type != 'mapChart'
            && type != 'ganttChart') {
            PSR.Message.error('不支持的图表类型：' + chartType);
        } else if (!options || JSON.stringify(options) == '{}') {
            if (this.chart) {
                this.chart.destroy();
            }
        } else {
            this.chart = Highcharts[type](
                chartBoxId,
                Object.assign({
                    chart: {
                        height: '100%'
                    }
                }, options, {
                    credits: {
                        text: 'Powered by zhoudd',
                        href: 'https://blog.csdn.net/zhoudingding'
                    },
                })
            );
        }
    },
    onResize: function (width, height) {
        this.chart.setSize(width, height);
    }
});