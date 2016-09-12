/**
 * Created by xzx on 2016/5/9.
 */
/**
 * Created by xzx on 2016/5/3.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    var commonModel = Backbone.Model.extend({
        //通用接口默认查询
        search: function (table, data, evName) {
            var that = this;
            var param = {};
            param.table = table;
            param.json = JSON.stringify(data);
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: rootUrl + '/jethis/query/get',
                reset: true,
                data: param
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = jctLibs.listToObject(res, 'rows')['rows'];
                that.trigger(evName, result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger(evName, result);

            })
        },
        //连接接口默认查询
        concatSearch: function (param, evName) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: rootUrl + '/jethis/concatquery/get',
                reset: true,
                data: param
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                that.trigger(evName, result);

            }).fail(function (err) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger(evName, result);

            })
        },
        //查询库存药物
        searchMedicine: function () {
            var that = this;
            var param = {};
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: 'http://192.168.0.220:8081/jethis/drugAlert/drugNumInfo',
                reset: true,
                data: {enterprise_id: sessionStorage.getItem('enterprise_id')}
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                that.trigger('getMedicine', result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger('getMedicine', result);

            })
        },
        searchRecord: function (patientId) {
            var that = this,param={};
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            param['patient_id'] = patientId;
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081" + '/jethis/diagnosis/medicalrecord',
                reset: true,
                data: param
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                that.trigger('getPatRecord', result);
            })
        },
        searchPatMember: function (param,evName,type) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: 'http://192.168.0.220:8081' + '/jethis/Customer/MemberAndPatientInfo'+'/'+type,
                reset: true,
                data: param,
                success: function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    that.trigger(evName, result);
                },
                error: function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger(evName, result);
                }
            })
        },
    })
    return commonModel;
});
