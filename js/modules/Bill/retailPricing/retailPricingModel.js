define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    var retailPricingModel = Backbone.Model.extend({
        getmcurStorage: function (goodsname,storatebatchno,goodstype) {
            var that = this;
            var result = {};
            var params={
                goods_name:goodsname,
                storate_batch_no:storatebatchno,
                goods_type:goodstype,
            };
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/drugAlert/drugNumInfo",
                data: params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getmcurStorage", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getmcurStorage", result);
            });
        },
        submitRecord: function (data) {
            var that = this;
            var result = {};
            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/DrugSell/GetNeedPayMoney",
                data: JSON.stringify(data)
            }).done(function (res) {
                result.errorNo = 0;
                result.charge = res.actualCharge;
                that.trigger("submitRecord", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("submitRecord", result);
            });
        },
        submitCharge: function (data) {
            var that = this;
            var result = {};
            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/DrugSell/newDrugSellRecord",
                data: JSON.stringify(data)
            }).done(function (res) {
                result.errorNo = 0;
                result.result = res.resultCode;
                that.trigger("submitCharges", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("submitCharges", result);
            });
        },
        searchRetail: function (data) {
            var that = this;
            var result = {};
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/DrugSell/SellMainRecord",
                data: data
            }).done(function (res) {
                result.errorNo = 0;
                result.dataNum= res.dataNum;
                result.rows = res.dataList;
                that.trigger("searchRetail", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("searchRetail", result);
            });
        },
    });


    return retailPricingModel;

});


