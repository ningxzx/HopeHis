/**
 * Created by xzx on 2016/5/3.
 */
    define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
        var rootUrl = "http://114.55.85.57:8081";
        var recipeMaintainModel = Backbone.Model.extend({
            //添加医嘱模板
            addTemp: function (type,param,evName) {
                var that = this;
                if(type=='post') {
                    param['enterprise_id'] = sessionStorage.getItem('enterprise_id');
                    param['enterprise_name'] = sessionStorage.getItem('enterprise_name')
                    param['doctor_name'] = sessionStorage.getItem('doctor_name')
                    if(param['doctor_name']=='undefined'&&param['template_power']==0){
                        alert('仅允许医生添加私有模板！')
                        return;
                    }
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
                    result =res;
                    result.errorNo = 0;
                    that.trigger(evName, result);
                }).fail(function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger(evName, result);

                })
            },
            //删除医嘱模板
            removeAdviceTemp: function (table_name,temp_id,evName) {
                var that = this;
                var param={};
                param['tableName']=table_name;
                param['template_id']=temp_id;

                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: "",
                    type:evName.replace('delete','').toLowerCase()
                };
                $.ajax({
                    type: "delete",
                    url: rootUrl+'/jethis/setting/templateSetting',
                    reset: true,
                    data:param
                }).done(function (res) {
                    result.errorNo = 0;
                    result.tip = res['tip'];
                    that.trigger(evName, result);
                }).fail(function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger(evName, result);
                })
            },
            addRecipeDetail: function (param) {
                var that = this;
                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: ""
                };
                $.ajax({
                    type: "post",
                    url: rootUrl+'/jethis/PresTemplateDetail',
                    reset: true,
                    data: JSON.stringify(param)
                }).done(function (res) {
                    result.errorNo = 0;
                    result.tip = res['RESULT'];
                    that.trigger('postDetail', result);
                }).fail(function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger('postDetail', result);
                })
            }
        });
        return recipeMaintainModel;
    });
