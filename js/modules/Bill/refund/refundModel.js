/**
 * Created by insomniahl on 15/11/23.
 * 退费
 */
define(["jquery", "backbone", "jctLibs"], function ($, Backbone, jctLibs) {
    var urlRoot = "http://114.55.85.57:8081";
    var refundModel = Backbone.Model.extend({
        getDetail: function (order, type) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/concatquery/get",
                type: "get",
                data: $.param({
                    "json": JSON.stringify({
                        "from": "trading.charge_order_no as bill",
                        "LEFT trading.billing_record.billing_record_id as bill_id|bill.billing_id": "",
                        "LEFT customer.patient.patient_id as pat|bill_id.patient_id": "",
                        "bill.order_no": order,
                        "bill.state": type
                    })
                })
            }).done(function (response) {
                if (!!response) {
                    result = {
                        errorNo: 0,
                        //data: jctLibs.listToObject(response, "rows")["rows"]
                        data: response
                    };
                }
                that.trigger("getResult", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("getResult", result);
            });
        },
        refund: function (data) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/Refunding/NewRecord",
                type: "post",
                data: JSON.stringify(data),
            }).done(function (res) {
                result.state = res['resultCode'];
                result.errorNo = 0;
                that.trigger("backResult", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("backResult", result);
            });
        }
    });

    return refundModel;
});