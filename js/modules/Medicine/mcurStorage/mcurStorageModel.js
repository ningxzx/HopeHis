define(["jquery", "backbone"],function($, Backbone) {
    var rootUrl = "http://192.168.0.220:8081";
    var mcurStorageModel = Backbone.Model.extend({
        getmcurStorage: function (goodsname,storatebatchno,goodstype) {
            var that = this;
            var result = {};
            var params={
                goods_name:goodsname,
                batch_no:storatebatchno,
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
    });
    return mcurStorageModel;
})