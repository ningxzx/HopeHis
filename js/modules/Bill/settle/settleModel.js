define(["jquery", "backbone", "jctLibs"], function ($, Backbone, jctLibs) {
    var urlRoot = "http://114.55.85.57:8081";
    var settleModel = Backbone.Model.extend({
        getMainRecord: function (data) {
            var that = this, result = {},param=data||{};
            param.enterprise_id = sessionStorage.getItem('enterprise_id');
            param.state ='wjs';
            $.ajax({
                url: urlRoot + "/jethis/Charging/WaitBalance",
                type: "get",
                data: $.param(param),
                success:function (res) {
                    result.errorNo=0;
                    result.rows=res;
                    that.trigger("getMainRecord", result);
                }
            });
        },
        getBillRecord: function (data) {
            var that = this, result = {},param=data||{};
            param.enterprise_id = sessionStorage.getItem('enterprise_id');
            param.state ='wjs';
            $.ajax({
                url: urlRoot + "/jethis/Charging/MainRecord",
                type: "get",
                data: $.param(param),
                success:function (res) {
                    result.errorNo=0;
                    result.rows=res;
                    that.trigger("getBillRecord", result);
                }
            });
        },
        chargeCost: function (data) {
            var that = this, result = {},param=data||{};
            param.enterprise_id = sessionStorage.getItem('enterprise_id');
            param.state ='wjs';
            $.ajax({
                url: urlRoot + "/jethis/Money/ChargeCosts",
                type: "get",
                data: $.param(param),
                success:function (res) {
                    result.errorNo=0;
                    result.charges=res;
                    that.trigger("chargeCost", result);
                }
            })
        },
        balanceRecord: function (data) {
            var that = this, result = {},param=data||{};
            $.ajax({
                url: urlRoot + "/jethis/Balance/NewBalanceRecord",
                type: "post",
                data: JSON.stringify(param),
                success:function (res) {
                    result.errorNo=0;
                    result.resultCode=res.resultCode;
                    that.trigger("balanceRecord", result);
                }
            })
        }
    });

    return settleModel;
});