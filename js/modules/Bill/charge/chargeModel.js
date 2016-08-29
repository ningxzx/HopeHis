/**
 * Created by insomniahl on 15/11/23.
 * 收费，结算
 */
define(["jquery", "backbone", "jctLibs"], function ($, Backbone, jctLibs) {
    var urlRoot = "http://114.55.85.57:8081";
    var chargeModel = Backbone.Model.extend({
        getCharge: function (data) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/patient/DiagnosisRecord",
                type: "get",
                data: {
                    "patient_id": data.patient_id,
                    "patient_name": data.patient_name
                }
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        data: response
                    };
                }
                that.trigger("getCharge", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("getCharge", result);
            });
        },
        chargeDetail: function (diag_id, discount) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/patient/DetailItem",
                type: "get",
                data: {"diagnosis_id": diag_id, "discount": discount}
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        rows: response['detailList'],
                        total: response['totalCosts']
                    };
                }
                that.trigger("recordDetail", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("recordDetail", result);
            });
        },
        chargeBilling: function (param) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/trading/BillTotalCosts",
                type: "post",
                data: JSON.stringify(param)
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        fee: response.totalCosts
                    };
                }
                that.trigger("billFinish", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("billFinish", result);
            });
        },
        chargeFinish: function (data) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/trading/Charging/NewRecord/CF",
                type: "post",
                data: JSON.stringify(data),
                success: function (res) {
                    result.resultCode = res.resultCode;
                    that.trigger("feeFinish", result);
                }
            })

        },
        updateRecord: function (data) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/charge/billingmodify",
                type: "post",
                data: JSON.stringify({
                    "record_id": data.record_id,
                    "billing_item_num": data.item_num,
                    "unit_price": data.price
                })
            }).done(function (response) {
                if (response.tip == "1") {
                    data.row["billing_item_num"] = data.item_num;
                    data.row["total_costs"] = data.item_num * data.row["unit_price"];
                    result = {
                        errorNo: 0,
                        index: data.index,
                        row: data.row
                    };
                }
                that.trigger("updateResult", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("updateResult", result);
            });
        },
        deleteRecord: function (data) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/charge/billingmodify",
                type: "delete",
                data: $.param({
                    "record_id": data.record_id,
                    "billing_record_id": data.billing_record_id
                })
            }).done(function (response) {
                if (response.tip == "1") {
                    result = {
                        errorNo: 0,
                        record: data.record_id
                    };
                }
                that.trigger("deleteResult", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("deleteResult", result);
            });
        }
    });

    return chargeModel;
});
