define(["backbone", "jctLibs"], function (Backbone, jctLibs) {
    // 病历Model，包含
    var recipeTempDetailModel = Backbone.Model.extend({
        defaults: {
            "english_names": "",//英文名称
            "good_num": "",//病历总费用
            "goods_name": "",//医嘱
            "id": "",//诊断结果
            "business_name": "",//机构ID
            "take_way": "",//服用方式
            "packing_spec": "",//医生姓名
            "drug_spec": "",//药物规格
            "take_times": "",//服用频率
            "take_num": "", //每次服用数量
            "orig_fee":"",//药品应收费用
            "charge_fee":"",//药品实收费用
            "drug_cost":"",//成本价
            "drug_unit":""//药品单位
        },
        url:"http://114.55.85.57:8081/jethis/query/get",
        getDetail: function (ownerId,table) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                responseData: [],
                errorInfo: ""
            };
            this.fetch({
                reset: true,
                data: $.param({
                    table:table,
                    json: JSON.stringify({
                        template_id:ownerId
                    })
                }),
                success: function (model, response) {
                    if(response.rows) {
                        result.tempDetail = jctLibs.listToObject(response, "rows")["rows"];
                        result.errorNo = 0;
                        that.trigger("recipeTempDetailGetted", result);
                    }
                },
                error: function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.resultInfo = responseText.message;
                    that.trigger("recipeTempDetailGetted", result);
                }
            })
        }
    });
    return recipeTempDetailModel;
})
