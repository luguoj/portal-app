Ext.define('PSR.util.Xlsx', {
    singleton: true,
    read: function (opt) {
        if (opt && opt.file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const jsonData = PSR.util.Xlsx.extractData(e.target.result);
                if (opt.success) {
                    opt.success(jsonData);
                }
            }
            reader.readAsBinaryString(opt.file);
        }
    },
    extractData: function (result) {
        const data = XLSX.read(result, {
            type: 'binary'
        });
        const jsonData = {};
        if (data.SheetNames && data.SheetNames.length > 0) {
            for (let i = 0; i < data.SheetNames.length; i++) {
                const sheetName = data.SheetNames[i],
                    sheetJson = XLSX.utils.sheet_to_json(data.Sheets[sheetName]);
                jsonData[sheetName] = sheetJson;
            }
        }
        return jsonData;
    },
    write: function (opt) {
        if (opt) {
            if (opt.data) {
                const workbook = {SheetNames: [], Sheets: {}};
                for (const sheetName in opt.data) {
                    workbook.SheetNames.push(sheetName);
                    workbook.Sheets[sheetName] = XLSX.utils.json_to_sheet(opt.data[sheetName]);
                }
                XLSX.writeFile(workbook, opt.filename ? opt.filename : 'export.xlsx');
            }
        }
    }
});