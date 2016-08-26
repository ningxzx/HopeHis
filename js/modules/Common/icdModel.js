/**
 * Created by insomniahl on 15/12/24.
 */
define(['backbone','jctLibs'], function (Backbone,jctLibs) {
    var icd10Model = Backbone.Model.extend({
        defaults:{
            id:"",//编号
            icd_10_name:"",//
            icd_10_inp:"",//
            icd_10_cod:"",//
            icd_10_co1:"",//
            descriptio:"",//
            statusipti:"",//
            buildtime1:"",//
            abolition:""//
        },
        idAttribute:"",

        //获取所有的icd10
        getAllIcd10: function () {
            var that=this, result = new jctLibs.jetHisResult();
            //todo:url更改
            this.url="http://192.168.0.220:8081/jetHis/patient";
            this.fetch({
                //data: $.param({
                //}),
                success: function (model, response) {
                    result.errorNo=0;
                    result.resData=response["patient"];
                    that.trigger("icd10Result",result);
                },
                error: function (err, response) {
                    var responseText=$.parseJSON(err.responseText);
                    result.errorNo=responseText.code;
                    result.resData=responseText.message;
                    that.trigger("icd10Result",result);
                }
            })
        }
    });

    return icd10Model;
});
