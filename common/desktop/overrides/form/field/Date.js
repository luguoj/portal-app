Ext.define('PSR.overrides.Ext.form.field.Date', {
    override: 'Ext.form.field.Date',
    format: 'Y-m-d H:i:s.u',
    altFormats: 'Y-m-d\\TH:i:s.u'
});