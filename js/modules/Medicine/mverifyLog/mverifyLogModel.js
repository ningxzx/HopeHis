/**
 * Created by insomniahl on 16/4/25.
 */
define(["backbone"], function (Backbone) {
    var rootUrl = "http://114.55.85.57:8081";
    var mverifyLogModel = Backbone.Model.extend({
        getrendeMy: function (startdatetime,enddatetime,batchno,goodstype,goods_name,changeState) {
            var that = this;
            var result = {};
            var params={
                start_date_time:startdatetime||"",
                end_date_time:enddatetime||"",
                batch_no:batchno||"",
                goods_type:goodstype||"",
                goods_name:goods_name||""
            };
            if(changeState&&changeState!='all'){
                params['change_state']=changeState;
            }
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/goods/setPonitRecord",
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


    return mverifyLogModel;
});
