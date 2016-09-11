/**
 * Created by insomniahl on 16/4/25.
 */
define(['jquery',"backbone",'jctLibs'], function ($,Backbone,jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    var mdictionaryModel = Backbone.Model.extend({
        //保存药物
        addDrug:function (data) {
            var that = this;
            var result = {};
            var params=data||{};
            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/drug/addNewDrug",
                data: JSON.stringify(params),
                success:function (res) {
                    result=res;
                    that.trigger("addDrug", result);
                }
            })
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
        },
        searchOwnDrug:function(data){
            var that = this;
            var result = {},param=data||{};
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/drug/customDrug",
                data:param,
                success:function (res) {
                    result.errorNo=0;
                    result.rows=res;
                    that.trigger("searchOwnDrug", result);
                }
            })
        },
        editOwnDrug:function(drug_id,data){
            var that = this;
            var result = {},param=data||{};
            $.ajax({
                type: "patch",
                url: rootUrl + "/jethis/drug/updateDrugInfo/"+drug_id,
                data:JSON.stringify(param),
                success:function (res) {
                    result=res;
                    that.trigger("editOwnDrug", result);
                }
            })
        }
    });


    return mdictionaryModel;
});
