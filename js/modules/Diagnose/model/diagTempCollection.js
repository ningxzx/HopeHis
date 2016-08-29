//=LOWER(B1)&":"&""""&" "&""""&",//"&C1
//字段中文名作为注释
//属性名称为下划线，英文小写
//idAttribute 默认为''

define(["backbone", "jctLibs"], function (Backbone, jctLibs) {
    // 诊断模板Model，包含
    var diagTempModel = Backbone.Model.extend({
        defaults: {
            template_id: " ",//模板ID
            template_name: " ",//模板名称
            template_power: " ",//模板权限
            template_owner_id: " ",//模板所有者ID
            template_owner_name: " ",//模板所有者姓名
            template_owner_code: " ",//模板所有者拼音码
            template_detail: " ",//模板内容
            doc_advice_temp_id: " ",//医嘱模板ID
            pres_temp_id: " ",//处方模板ID
        },
        idAttribute: "template_id"
    });
    var diagTempCollection = Backbone.Collection.extend({
        model: diagTempModel,
        url: "http://URL/diagTemps/",
        getDiagTemp: function (ownerId, templateType) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                responseData: [],
                errorInfo: ""
            };
            this.fetch({
                url: "http://114.55.85.57:8081/jethis/query/get",
                reset: true,
                data:$.param({
                    table:templateType,
                    json: JSON.stringify({
                        template_owner_id:ownerId
                    })
                }),
                success: function (model, response) {
                    if(response.rows) {
                        result.diagTemps = jctLibs.listToObject(response, "rows")["rows"];
                        result.errorNo = 0;
                        that.trigger("diagTempGetted", result);
                    }
                },
                error: function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.resultInfo = responseText.message;
                    that.trigger("diagTempGetted", result);
                }
                //success: function (model, response) {
                //    if (templateType == "template.diagnosis_template") {
                //        var diagTemps = response[templateType];
                //        for (var key in diagTemps) {
                //            if (diagTemps.hasOwnProperty(key)) {
                //                var diagTemp = diagTemps[key], diag = {};
                //                diag.diag = jctLibs.listToObject(diagTemp[0], "Diagnosis_template")["Diagnosis_template"];
                //                if (diagTemp[1].Doctor_advice_template) {
                //                    diag.advice = jctLibs.listToObject(diagTemp[1], "Doctor_advice_template")["Doctor_advice_template"];
                //                }
                //                if (diagTemp[2].Prescription_template) {
                //                    diag.recipe = jctLibs.listToObject(diagTemp[2], "Prescription_template")["Prescription_template"];
                //                }
                //                result.responseData.push(diag);
                //            }
                //        }
                //    }
                //    result.errorNo = 0;
                //    that.trigger("diagTempGetted", result);
                //
                //},
                //error: function (err, response) {
                //    var responseText = $.parseJSON(err.responseText);
                //    result.errorNo = responseText.code;
                //    result.resultInfo = responseText.message;
                //    that.trigger("diagTempGetted", result);
                //}
            })
        },
    });

    return diagTempCollection;

});
