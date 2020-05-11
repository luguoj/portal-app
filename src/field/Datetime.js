Ext.define('PSR.field.Datetime', {
    extend: 'Ext.field.Container',
    xtype: 'psr-field-datetime',
    items: [{
        xtype: 'datefield', placeholder: '日期',
        dateFormat: 'Y-m-d',
        flex: 1
    }, {
        xtype: 'timefield', placeholder: '时间',
        format: 'H:i:s',
        flex: 1
    }],
    getValue: function () {
        var date = this.getAt(0).getRawValue();
        var time = this.getAt(1).getRawValue();
        return date && time ? (date + ' ' + time) : null;
    },
    setValue: function (value) {
        var datetime = value ? Ext.Date.parse(value, "Y-m-d H:i:s") : null;
        this.getAt(0).setValue(datetime);
        this.getAt(1).setValue(datetime);
    }
});
