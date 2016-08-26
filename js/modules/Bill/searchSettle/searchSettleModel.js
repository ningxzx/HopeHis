/**
 * Created by insomniahl on 15/11/23.
 * 查询结算人员结算
 */
define(["jquery", "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    var searchSettleModel = Backbone.Model.extend({
        getBalanceRecord: function (data) {
            var that = this, result = {},param=data||{};
            param.enterprise_id = sessionStorage.getItem('enterprise_id');
            $.ajax({
                url: rootUrl + "/jethis/Balance/BalanceRecord",
                type: "get",
                data: param
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        rows: response
                    };
                }
                that.trigger("searchRecord", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("searchRecord", result);
            });
        },
    });


    return searchSettleModel;
});