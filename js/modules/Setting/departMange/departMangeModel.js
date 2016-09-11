define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var departmentModel = Backbone.Model.extend({
        getDepts: function (enterprise_id) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: "http://192.168.0.220:8081/jethis/department/all",
                reset: true,
                data: {epid: enterprise_id}
            }).done(function (res) {
                if(!!res.rows) {
                    result.errorNo = 0;
                    result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                    that.trigger("deptsGetted", result);
                } else {
                    result.errorNo = 1;
                    that.trigger("deptsGetted", result);
                }

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deptsGetted", result);

            })
        },
        updateDept: function (postData) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type:'post',
                url: "http://192.168.0.220:8081/jethis/department/edit",
                reset: true,
                data: JSON.stringify(postData)
            }).done(function (res) {
                if(!!res.result) {
                    result.errorNo = 0;
                    result.status = res.result;
                    that.trigger("deptUpdated", result);
                } else {
                    result.errorNo = 1;
                    that.trigger("deptUpdated", result);
                }

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deptUpdated", result);

            })
        },
        addDept: function (postData) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                responseData: "",
                errorInfo: ""
            };
            $.ajax({
                type: 'post',
                url: "http://192.168.0.220:8081/jethis/department/add",
                reset: true,
                data: JSON.stringify(postData)
            }).done(function (res) {
                if(!!res.result) {
                    result.errorNo = 0;
                    result.status = res.result;
                    that.trigger("deptAdded", result);
                }else {
                    result.errorNo = 1;
                    that.trigger("deptAdded", result);
                }

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deptAdded", result);

            })
        },
        delDept: function (deptId) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                responseData: "",
                errorInfo: ""
            };
            $.ajax({
                type: 'get',
                url: "http://192.168.0.220:8081/jethis/department/del",
                reset: true,
                data: {depid:deptId}
            }).done(function (res) {
                if(!!res.status) {
                    result.errorNo = 0;
                    result.status = res.status;
                    that.trigger("deptDeleted", result);
                } else {
                    result.errorNo = 1;
                    that.trigger("deptDeleted", result);
                }

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deptDeleted", result);

            })

        }
    })

    return departmentModel;
});
