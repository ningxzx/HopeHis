define(["backbone"], function (Backbone) {
    var rootUrl = "http://192.168.0.220:8081";
    var outpatientChargesModel = Backbone.Model.extend({
        getrendeMy: function (startdatetime,enddatetime,batchno,goodstype,goodsstamp) {
            var that = this;
            var result = {};
            var params={
                start_date_time:startdatetime,
                end_date_time:enddatetime,
                batch_no:batchno,
                goods_type:goodstype,
                goods_stamp:goodsstamp
            };

            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/goods/setPonitRecord/1",
                data: params
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
    });
    return outpatientChargesModel;

});