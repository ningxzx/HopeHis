/**
 * Created by xzx on 2016/5/5.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    // 获取诊疗项目
    var myPatModel = Backbone.Model.extend({
        getPats: function (data) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/DiagnosisHistory/PatientInfo",
                type: 'get',
                data:data,
                success: function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    _this.trigger("patsGetted", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("patsGetted", result);
                }
            })
        },
        submitGroup: function (data) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Group/newGroup",
                type: 'post',
                data:JSON.stringify(data),
                success: function (res) {
                    result.errorNo = 0;
                    result.result = res['RESULT'];
                    _this.trigger("submitGroup", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("submitGroup", result);
                }
            })
        },
        updateGroup: function (data,group_id) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Group/UpdateInfo/"+group_id,
                type: 'patch',
                data:JSON.stringify(data),
                success: function (res) {
                    result.errorNo = 0;
                    result.result = res.RESULT;
                    _this.trigger("updateGroup", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("updateGroup", result);
                }
            })
        },
        getGroupPats: function (condition) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Group/GetPatientInfo",
                type: 'get',
                data:condition,
                success: function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    _this.trigger("patsGetted", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("patsGetted", result);
                }
            })
        },
        delGroup: function (id) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Group/DeleteGroup/"+id,
                type: 'delete',
                success: function (res) {
                    result.errorNo = 0;
                    result.state = res.state;
                    _this.trigger("groupDelete", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("groupDelete", result);
                }
            })
        },

    });


    return myPatModel;

});