Ext.define('PSR.form.field.Date', {
    extend: 'Ext.form.field.Date',
    xtype: 'psr-datefield',
    format: 'Y-m-d H:i:s.u',
    altFormats: 'Y-m-d\\TH:i:s.u'
});