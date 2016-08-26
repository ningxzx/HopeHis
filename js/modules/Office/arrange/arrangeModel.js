define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    // 机构用户关系模板Model
    var scheduleModel = Backbone.Model.extend({
        postSchedule: function (sche) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: 'http://192.168.0.220:8081/jethis/schedu/workPlan',
                data: JSON.stringify(sche)
            }).done(function (res) {
                result.errorNo = 0;
                result.status = res.state;
                that.trigger("planPosted", result);

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("planPosted", result);

            })
        },
        getSchedule: function (dept_id,stime, etime) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                    type: "get",
                    url: 'http://192.168.0.220:8081/jethis/schedu/scheduResult',
                    data: {
                        start_date_time: stime,
                        enterprise_id: sessionStorage.getItem('enterprise_id'),
                        department_id:dept_id,
                        end_date_time: etime
                    }
                })
                .done(function (res) {
                    result.errorNo = 0;
                    result.sches = res;
                    that.trigger("planGetted", result);

                })
                .fail(function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger("planGetted", result);
                })
        },
        getDept: function () {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                    type: "get",
                    url: 'http://192.168.0.220:8081/jethis/department/all',
                })
                .done(function (res) {
                    result.errorNo = 0;
                    result.rows = jctLibs.listToObject(res, 'rows')['rows'];
                    that.trigger("deptGetted", result);
                })
                .fail(function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger("deptGetted", result);
                })
        },
        getDeptDoctor: function (deptId) {
            var that = this;
            var param = {
                "enterprise_id": sessionStorage.getItem('enterprise_id'),
                "department_id": deptId
            }
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                    type: "get",
                    data: param,
                    url: 'http://192.168.0.220:8081/jethis/doctordepartment/get',
                })
                .done(function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    that.trigger("doctorGetted", result);
                })
                .fail(function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger("doctorGetted", result);
                })
        },
        getLevelfee: function () {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: 'http://192.168.0.220:8081/jethis/setting/standardRegfeeSet',
                data: {enterprise_id:sessionStorage.getItem('enterprise_id')}
            }).done(function (data) {
                result.errorNo=0;
                result.rows=jctLibs.listToObject(data,'rows')['rows'];
                that.trigger("getLevelFee", result);
            }).fail(function (error) {
                result.data = "错误状态:"+error.readyState + ",错误原因:" +error.responseText;
                result.errorNo = -1;
                that.trigger("getLevelFee", result);
            });
        }
    });
    return scheduleModel;

});

