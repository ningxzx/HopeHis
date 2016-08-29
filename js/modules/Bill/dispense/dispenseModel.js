/**
 * Created by xzx on 2016/5/3.
 */
define(["jquery", "backbone"],
    function ($, Backbone) {
        var rootUrl = "http://114.55.85.57:8081";
        var dispenseModel = Backbone.Model.extend({
            dispenseDrug: function (param) {
                var _this = this, result = {};
                $.ajax({
                    url: rootUrl+"/jethis/Charging/WaitingSendDrug",
                    type: 'get',
                    data: $.param(param),
                    success: function (res) {
                        result.rows = res;
                        _this.trigger("getDrug", result);
                    },
                    error: function (err) {
                        result.errorNo = -1;
                        result.status = err.status;
                        result.responseData = err.statusText;
                        _this.trigger("getDrug", result);
                    }
                })
            },
            dispense: function (param) {
                var _this = this, result = {};
                $.ajax({
                    url: rootUrl+"/jethis/DrugSell/PresSell",
                    type: 'post',
                    data: JSON.stringify(param),
                    success: function (res) {
                        result.result = res['RESULT'];
                        _this.trigger("dispenseCallback", result);
                    },
                    error: function (err) {
                        result.errorNo = -1;
                        result.status = err.status;
                        result.responseData = err.statusText;
                        _this.trigger("dispenseCallback", result);
                    }
                })
            },
        });
        return dispenseModel;
    });
