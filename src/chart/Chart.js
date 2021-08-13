Ext.define('PSR.Chart', {
    xtype: 'psr-chart',
    extend: 'Ext.Component',
    element: {
        reference: 'element',
        style: 'overflow:auto',
        class: 'x-nativescroller',
        children: [{
            reference: 'chartbox'
        }]
    },
    createChart: function (type, options) {
        const chartBoxId = this.chartbox.dom.id;
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
                Object.assign({}, options, {
                    credits: {
                        text: 'Powered by zhoudd',
                        href: 'https://blog.csdn.net/zhoudingding'
                    },
                })
            );
        }
    }
});