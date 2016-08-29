/**
 * Created by xzx on 2016/5/5.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    // 获取诊疗项目
    var mnumChangeModel = Backbone.Model.extend({
        getRecord: function (name,stattime,endtime,type) {
            var _this = this, result = {};
            $.ajax({
                url: rootUrl+"/jethis/Goods/GetGoodsNumChange",
                type: 'get',
                data:{
                    goods_name:name,
                    start_date_time:stattime,
                    end_date_time:endtime,
                    change_way:type
                },
                success: function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    _this.trigger("getRecord", result);
                },
                error: function (err) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    _this.trigger("getRecord", result);
                }
            })
        },
    });


    return mnumChangeModel;

});