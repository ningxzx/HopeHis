define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    var allNewsModel = Backbone.Model.extend({
        //默认查询
        gethistoryreder: function (reviewresult,goodsname,startdatetime,enddatetime) {
            var that = this;
            var result = {};
            var params={
                title:reviewresult,
                user_name:goodsname,
                start_date_time:startdatetime,
                end_date_time:enddatetime
            };
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/news/getNewsRecord",
                data: params
            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("gethistoryreder", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("gethistoryreder", result);
            });
        },

        //消息内容
        getcontent:function (id) {
            var that = this;
            var result = {};
            var params={
            };
            $.ajax({
                type: "GET",
                url: rootUrl + "/jethis/news/messageValue/"+id,

            }).done(function (rows) {
                result.errorNo = 0;
                result.rows = rows;
                that.trigger("getcontent", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getcontent", result);
            });
        },




    });
    return allNewsModel;
});


