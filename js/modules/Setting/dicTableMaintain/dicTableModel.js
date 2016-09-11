/**
 * Created by xzx on 2016/5/3.
 */
define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    var recipeMaintainModel = Backbone.Model.extend({
        //获取处方模板
        getTemp: function (type,param) {
            var that = this;
            if(type=='post') {
                param['enterprise_id'] = sessionStorage.getItem('enterprise_id');
                param['enterprise_name'] = sessionStorage.getItem('enterprise_name')
                param['doctor_name'] = sessionStorage.getItem('doctor_name')
            }
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: type,
                url: rootUrl+'/jethis/setting/templateSetting',
                reset: true,
                data: JSON.stringify(param)
            }).done(function (res) {
                result.errorNo = 0;
                result.tips =res.tip;
                that.trigger("addAdvice", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("addAdvice", result);

            })
        },
        //删除医嘱模板
        removeAdviceTemp: function (table_name,temp_id) {
            var that = this;
            var param={};
            param['tableName']=table_name;
            param['template_id']=temp_id;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "delete",
                url: rootUrl+'/jethis/setting/templateSetting',
                reset: true,
                data:param
            }).done(function (res) {
                result.errorNo = 0;
                result.tip = res['tip'];
                that.trigger("deleteAdvice", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deleteAdvice", result);
            })
        },
    });
    return recipeMaintainModel;
});
