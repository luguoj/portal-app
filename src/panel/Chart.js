Ext.define('PSR.panel.Chart', {
    xtype: 'psr-panel-chart',
    extend: 'Ext.Component',
    element: {
        reference: 'element',
        children: [{
            reference: 'chartbox'
        }],
        style: 'overflow:auto'
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