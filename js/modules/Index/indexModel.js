/**
 * Created by xzx on 2016/5/3.
 */
define(["jquery", "backbone"],
    function ($, Backbone) {
        var rootUrl = "http://192.168.0.220:8081";
        var indexModel = Backbone.Model.extend({
            getTodaynews: function () {
                var that = this;
                var result = {};
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/news/allNewsRecord/1",
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getTodaynews", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getTodaynews", result);
                });
            },
            getDynamicNews: function () {
                var that = this;
                var result = {};
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/News/GetNewsRecord",}).done(function (res) {
                    result.errorNo = 0;
                    result.rows = res;
                    that.trigger("getDynamicNews", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getDynamicNews", result);
                });
            },
            getHospitalCondition: function () {
                var that = this;
                var result = {};
                $.ajax({
                    type: "get",
                    url: rootUrl + "/common/HomePageInfo",
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = [rows];
                    that.trigger("getHospCondition", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getHospCondition", result);
                });
            },
        });
        return indexModel;
    });
