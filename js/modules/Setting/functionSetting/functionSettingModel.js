define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var functionSettingModel = Backbone.Model.extend({
        postSetting: function (data) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: "http://192.168.0.220:8081/jethis/FunctionSetting",
                reset: true,
                data: JSON.stringify(data),
                success: function (res) {
                    result.errorNo = 0;
                    result.status = res['RESULT']
                    that.trigger("fsPost", result);
                }
            })
        },
        saveWay: function (data) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: "http://192.168.0.220:8081/jethis/FunctionSetting",
                reset: true,
                data: JSON.stringify(data),
                success: function (res) {
                    result.errorNo = 0;
                    result.status = res['RESULT']
                    that.trigger("saveResult", result);
                },
                error: function (err) {
                    result.errorNo = -1;
                    result.errorInfo = err;
                    that.trigger("saveResult", result);
                }
            })
        }
    });

    return functionSettingModel;
});
