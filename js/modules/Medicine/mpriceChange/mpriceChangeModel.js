/**
 * Created by xzx on 2016/5/3.
 */
define(["jquery", "backbone"], function ($, Backbone) {
        var rootUrl = "http://114.55.85.57:8081";
        var mpriceChangeModel = Backbone.Model.extend({

            //查询
            getrenderModel: function (goodsname,goodstype) {
                var that = this;
                var result = {};
                var params={
                    goods_name:goodsname,
                    goods_type:goodstype
                };

                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/drugAlert/drugNumInfo",
                    data: params
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getrenderModel", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getrenderModel", result);
                });
            },

            //提交审核
            submitInfo: function (goodscode,batchno,oldpf,newpf,oldsf,newsf) {
                var that = this;
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/price/adjustPrice",
                    data: JSON.stringify({
                        goods_code:goodscode,
                        batch_no:batchno,
                        before_change_sell_price:oldpf,
                        after_change_sell_price:newpf,
                        before_change_pesc_price:oldsf,
                        after_change_pesc_price:newsf
                    })
                }).done(function (data) {
                    var result = {};
                         result.errorNo = 0;
                        result.rows = data;
                        that.trigger("submitInfo", result);

                }).fail(function (error) {
                    var result = {};
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("submitInfo", result);
                });
            },

        });
        return mpriceChangeModel;
    });
