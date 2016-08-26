//=LOWER(B1)&":"&""""&" "&""""&",//"&C1
define(["jquery", "backbone"],function ($, Backbone) {
    var rootUrl = "http://192.168.0.220:8081";
    var priceChangeModel = Backbone.Model.extend({
        getpricerender: function (goodsname,reviewresult,startdatetime,enddatetime) {
            var that = this;
            var result = {};
            var params={
                goods_name:goodsname,
                review_result:reviewresult,
                start_date_time:startdatetime,
                end_date_time:enddatetime

            };
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/price/adjustPriceRecord",
                data: params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getpricerender", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getpricerender", result);
            });
        },
        //审核确认
        postpriceModel: function (reviewresult,reviewid) {
            var that = this;
            var result = {};
            var params={
                review_result:reviewresult,
                review_id:reviewid
            };
            $.ajax({
                type: "post",
                url: rootUrl + "/jethis/review/reviewRecord/30",
                data:  JSON.stringify(params)
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("postpriceModel", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("postpriceModel", result);
            });
        },



    });
    return priceChangeModel;
});