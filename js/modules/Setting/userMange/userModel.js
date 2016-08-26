/**
 * Created by xzx on 2016/4/25.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var userModel = Backbone.Model.extend({
        getDoctors: function (state) {
            var that = this, st = state || 2;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/doctor/get",
                reset: true,
                data: {enterprise_id: sessionStorage.getItem('enterprise_id'), state: state}
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                if (st == 1) {
                    that.trigger("getCheckDoctors", result);
                }
                else if (st == 2) {
                    that.trigger("getDoctors", result);
                }
                else if (st == 3) {
                    that.trigger("getRefuseDoctors", result);
                }
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                if (st == 1) {
                    that.trigger("getCheckDoctors", result);
                }
                else if (st == 2) {
                    that.trigger("getDoctors", result);
                }
                else if (st == 3) {
                    that.trigger("getRefuseDoctors", result);
                }

            })
        },
        passDoctor: function (data) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: "http://192.168.0.220:8081/jethis/hook/doctor",
                reset: true,
                data: JSON.stringify({
                    enterprise_id: data.enterprise_id, //机构ID
                    enterprise_name: data.enterprise_name,     //机构全名
                    login_account_id: data.login_account_id,     //用户登录帐号
                    department_id: data.department_id, //科室ID
                    account_id: data.account_id, //创建管理员 ID
                    department_name: data.department_name,     //科室名
                    title_code: data.title_code, //医生职称
                    title_name: data.title_name //医生职称
                })
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                that.trigger("passDoctor", result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("passDoctor", result);
            })
        },
        checkDoctor: function (conid, state, depid, depname) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/setting/modcommitstate",
                reset: true,
                data: {conid: conid, state: state, depid: depid, depname: depname}
            }).done(function (res) {
                result.errorNo = 0;
                result.status = res.result;
                that.trigger("getCheckedResult", result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("getCheckedResult", result);


            })
        },
        getEmployer: function () {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/setting/modcommitstate",
                reset: true,
                data: {enterprise_id: sessionStorage.getItem('enterprise_id')}
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = jctLibs.listToObject(res, 'rows')['rows'];
                that.trigger("getEmployers", result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("getEmployers", result);
            })
        },
        //获取所有用户
        getEmployers: function (id) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/user/getUserByEid?enterprise_id=" + id,
                reset: true,
            }).done(function (res) {
                result.errorNo = 0;
                result.rows = res;
                that.trigger("getEmployers", result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("getEmployers", result);
            })
        },
        //添加用户
        addEmployer: function (res) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: "http://192.168.0.220:8081/jethis/user/addUserByEid",
                data: JSON.stringify(res)
            }).done(function (res) {
                that.trigger("reEmployer", res);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("reEmployer", result);
            })
        },
        updateEmployer: function (res) {
            var that = this;
            var result = {
                errorNo: "0",//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "patch",
                url: "http://192.168.0.220:8081/jethis/user/modifyinfo",
                data: JSON.stringify(res)
            }).done(function (res) {
                if (res.RESULT == "OK") {
                    that.trigger("updateEmployer", result);
                }
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("updateEmployer", result);
            })
        },
        saveMenu: function (data) {
            var that = this;
            var result = {
                errorNo: "0",//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "patch",
                url: "http://192.168.0.220:8081/jethis/user/userRole",
                data: JSON.stringify(data)
            }).done(function (res) {
                if (res["RESULT"] == "OK") {
                    that.trigger("saveResult", result);
                }
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("saveResult", result);
            });
        },
        stateChange: function (data) {
            var that = this;
            var result = {
                errorNo: "0",//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "patch",
                url: "http://192.168.0.220:8081/jethis/Enterprise/Patch/AccountInfo",
                data: JSON.stringify(data)
            }).done(function (res) {
                if (res["resultCode"] == "100") {
                    that.trigger("stateResult", result);
                } else {
                    result.errorInfo = "操作失败";
                    result.errorNo = 1;
                    that.trigger("stateResult", result);
                }
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("stateResult", result);
            });
        }
    });
    return userModel
});
