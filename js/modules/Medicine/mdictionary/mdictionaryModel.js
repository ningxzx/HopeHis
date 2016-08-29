/**
 * Created by insomniahl on 16/4/25.
 */
define(['jquery',"backbone",'jctLibs'], function ($,Backbone,jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    var mdictionaryModel = Backbone.Model.extend({
        //保存中药
        SaveZY: function (data) {
            var that = this;
            var result = {};
            $.ajax({
                type: "post",
                data: JSON.stringify({
                    "drug_name": data.drugName,//药品名称
                    "drug_way": "2",
                    "drug_type": "ZY",
                    "enterprise_id": data.enterpriseId,//机构ID
                    "add_account_id": data.addAccountId,//添加药品的帐号ID
                    "drug_parts": data.drugParts,//药品成分
                    "memo": data.memo,    //说明
                    "drug_status": data.drugStatus,//药品状态
                    "drug_spec": data.drugSpec,//药物规格
                    "min_packing_unit":data.drugUnit//最小包装规格单位
                }),
                url: rootUrl + "/jethis/drug/addNewDrug"
            }).done(function (data) {
                result.errorNo = 0;
                result.rows = data;
                that.trigger("SaveZY", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("SaveZY", result);
            });
        },
        getDetail: function (data) {
            var that = this;
            var result = {};
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/DrugInfo/DrugInstructions",
                data: $.param(data)
            }).done(function (res) {
                result.errorNo = 0;
                result.rows=[];
                if(res.rows) {
                    result.rows = jctLibs.listToObject(res, 'rows')['rows'];
                }
                that.trigger("getDetail", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getDetail", result);
            });
        }
    });


    return mdictionaryModel;
});
