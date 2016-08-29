//=LOWER(B1)&":"&""""&" "&""""&",//"&C1
//字段中文名作为注释
//属性名称为下划线，英文小写
//idAttribute 默认为''

define(["backbone","jctLibs"],function(Backbone,jctLibs) {
    // 处方模板Model，包含
    var recipeTempModel = Backbone.Model.extend({
        defaults: {
            template_id:" ",//模板ID
            template_name:" ",//模板名称
            template_power:" ",//模板权限
            template_owner_id:" ",//模板所有者ID
            template_owner_name:" ",//模板所有者姓名
            template_owner_code:" ",//模板所有者拼音码
            template_detail:" ",//模板内容
        },
        idAttribute:"template_id"
    });



    var recipeTempCollection = Backbone.Collection.extend({
        model: recipeTempModel,
        url: "http://114.55.85.57:8081/jethis/query/get",
        getRecipeTemp: function (ownerId, templateType) {
            var that = this,result=new jctLibs.jetHisResult;
            this.fetch({
                reset: true,
                data: $.param({
                    table:templateType,
                    json: JSON.stringify({
                        template_owner_id:ownerId
                    })
                }),
                success: function (model, response) {
                    if(response.rows) {
                        result.resData = jctLibs.listToObject(response, "rows")["rows"];
                        result.errorNo = 0;
                        that.trigger("recipeTempGetted", result);
                    }
                },
                error: function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.resultInfo = responseText.message;
                    that.trigger("recipeTempGetted", result);
                }
            })
        }

    });

    return recipeTempCollection;

});
