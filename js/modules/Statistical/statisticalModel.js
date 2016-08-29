define(["jquery", "backbone"],function($, Backbone) {
    var rootUrl = "http://114.55.85.57:8081";
    var drugPurchaseModel = Backbone.Model.extend({
        //药品采购统计
        getDrugpurchase: function (start,end,Suppliername,Drugname,OddNumbers) {
            var that = this;
            var result = {};
            var params={
                start_date_time:start,
                end_date_time:end,
                suppliers_name:Suppliername,
                goods_name:Drugname,
                batch_no:OddNumbers,
            };
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/Statistics/DrugPurchase",
                data: params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getDrugpurchase", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getDrugpurchase", result);
            });
        },
        //月报表统计
        getrendeMy: function (param) {
            var that = this;
            var result = {};
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/Statistics/ReportFormStat/1",
                data: param
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getrendeMy", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getrendeMy", result);
            });
        },

        //年报表统计
        getYear: function (year) {
            var that = this;
            var result = {};
            var params={
                start_date_time:year,
            };

            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/Statistics/ReportFormStat/2",
                data: params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getYear", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getYear", result);
            });
        },
    });
    return drugPurchaseModel;
})