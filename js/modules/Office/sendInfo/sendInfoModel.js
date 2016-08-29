
define(["jquery", "backbone"],
    function ($, Backbone) {
        var rootUrl = "http://114.55.85.57:8081";
        var mWarningModel = Backbone.Model.extend({
            postsendInfo: function (titl,sendtoid,html) {
                var that = this;
                var result = {};
                var params={
                    title:titl,
                    send_to_id:sendtoid,
                    text_value:html
                };
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/news/newNewsRecord",
                    data: JSON.stringify(params)
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("postsendInfo", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("postsendInfo", result);
                });
            },

            //收件人提交
            getsend:function(){
                var that = this;
                var result = {};
                var params={

                };
                $.ajax({
                    type: "get",
                    url: rootUrl+'/jethis/customer/baseInfo',
                    data: params
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getsend", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getsend", result);
                });
            }

        });
        return mWarningModel;
    });
