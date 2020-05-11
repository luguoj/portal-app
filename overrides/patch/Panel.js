Ext.define('common.overrides.Ext.form.Panel', {
    override: 'Ext.form.Panel',
    privates: {
        beforeAjaxSubmit: function(form, options, successFn, failureFn) {
            var me = this,
                url = options.url || me.getUrl(),
                request = Ext.merge({}, {
                    url: url,
                    timeout: me.getTimeout() * 1000,
                    form: form,
                    scope: me
                }, options),
                formValues = {},
                jsonSubmit = me.jsonSubmit,
                paramsKey = 'params',
                contentType = 'x-www-form-urlencoded; charset=UTF-8',
                original, placeholder, formData;

            delete request.success;
            delete request.failure;

            if (jsonSubmit) {
                paramsKey = 'jsonData';
                contentType = 'json';
                formValues = me.getSubmitValues({
                    enabled: me.getStandardSubmit() || !options.submitDisabled
                });
                delete request.params;
                delete request.form;
            }

            request[paramsKey] = Ext.merge({}, me.getBaseParams(), options.params, formValues);
            request.header = Ext.apply({
                'Content-Type': 'application/' + contentType
            }, options.headers || {});

            request.callback = function(callbackOptions, success, response) {
                var responseText = response.responseText,
                    responseXML = response.responseXML,
                    statusResult = Ext.data.request.Ajax.parseStatus(response.status, response);

                if (form.$fileswap) {
                    Ext.each(form.$fileswap, function(item) {
                        original = item.original;
                        placeholder = item.placeholder;

                        placeholder.parentNode.insertBefore(original, placeholder.nextSibling);
                        placeholder.parentNode.removeChild(placeholder);
                    });

                    form.$fileswap = null;
                    delete form.$fileswap;
                }

                me.setMasked(false);

                if (response.success === false) {
                    success = false;
                }

                if (success) {
                    if (statusResult && responseText && responseText.length === 0) {
                        success = true;
                    }
                    else {
                        if (!Ext.isEmpty(response.responseBytes)) {
                            success = statusResult.success;
                        }
                        else {
                            if (
                                Ext.isString(responseText) &&
                                response.request.options.responseType === 'text'
                            ) {
                                response.success = true;
                            }
                            else if (Ext.isString(responseText)) {
                                try {
                                    response = Ext.decode(responseText);
                                }
                                catch (e) {
                                    response.success = false;
                                    response.error = e;
                                    response.message = e.message;
                                }
                            }
                            else if (Ext.isSimpleObject(responseText)) {
                                response = responseText;
                                Ext.applyIf(response, { success: true });
                            }

                            if (!Ext.isEmpty(responseXML)) {
                                response.success = true;
                            }

                            success = !!response.success;
                        }
                    }

                    if (success) {
                        successFn(response, responseText);
                    }
                    else {
                        failureFn(response, responseText);
                    }
                }
                else {
                    failureFn(response, responseText);
                }
            };

            if (Ext.feature.has.XHR2 && request.xhr2) {
                delete request.form;
                // bug fix begin--------------------------------
                formData = request.rawData = new FormData(form);
                // bug fix end--------------------------------
                if (request.params) {
                    Ext.iterate(request.params, function(name, value) {
                        if (Ext.isArray(value)) {
                            Ext.each(value, function(v) {
                                formData.append(name, v);
                            });
                        }
                        else {
                            formData.append(name, value);
                        }
                    });

                    delete request.params;
                }
            }

            return Ext.Ajax.request(request);
        }
    }
});
