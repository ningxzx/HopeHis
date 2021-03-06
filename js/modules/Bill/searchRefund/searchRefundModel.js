/**
 * Created by insomniahl on 15/11/23.
 * 查询结算
 */
define(["jquery","backbone", "jctLibs"], function ($,Backbone, jctLibs) {
    var urlRoot = "http://192.168.0.220:8081";
    var searchRefundModel = Backbone.Model.extend({
        getRefund: function (data) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/Refunding/AllRefundRecord",
                type: "get",
                data: data
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        data: response
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
        getRefundDetail: function (record_id) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/Refunding/DetailRefundRecord",
                type: "get",
                data: {refund_record_id:record_id}
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        data: response
                    };
                }
                that.trigger("getDetail", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("getDetail", result);
            });
        }
    });

    return searchRefundModel;
});
