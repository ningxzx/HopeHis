define(["backbone",'../../Diagnose/model/execitemModel','jctLibs'],function(Backbone, execitemModel, jctLibs) {
    var execitemCollection = Backbone.Collection.extend({
        model: execitemModel,
        url : "http://114.55.85.57:8081/jetHis/HealthProgram",
        getExecitems: function (itemType,enterpriseId,page,rowNum,searchWords) {
            var that=this;
            var result={
                errorNo:0,//0为正确的值，其余值为错误
                responseData:"",
                errorInfo:"",
                type:"execitems"
            };
            var data={
                item_type:itemType,//1代表诊疗项目,0代表检查项目,2代表检验项目
                enterprise_id:enterpriseId,
                page:page,
                row_num:rowNum
            };
            if(searchWords){
                data.search=searchWords;
                result.type="execitemsSearch";
            }
            this.fetch({
                data: $.param(data),
                success: function (model, response) {
                    result.errorNo=0;
                    result.execitems=jctLibs.listToObject(response["executive_item"], "data")["data"];
                    that.trigger("execitemsGetted",result);

                },
                error: function (err, response) {
                    var responseText=$.parseJSON(err.responseText);
                    result.errorNo=responseText.code;
                    result.resultInfo=responseText.message;
                    that.trigger("execitemsGetted",result);
                }
            })
        }


    });

    return execitemCollection;

});
