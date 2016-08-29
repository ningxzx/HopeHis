
define(["jquery", "backbone"],
    function ($, Backbone) {
        var rootUrl = "http://114.55.85.57:8081";
        var pdnModel = Backbone.Model.extend({
            postDn: function (title,html) {
                var that = this;
                var result = {};
                var params={
                    news_title:title,
                    news_value:html,
                    news_type:'YYXW'
                };
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/News/NewNewsRecord",
                    data: JSON.stringify(params)
                }).done(function (res) {
                    result.errorNo = 0;
                    result.status = res.resultCode;
                    that.trigger("postDn", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("postDn", result);
                });
            },

        });
        return pdnModel;
    });
