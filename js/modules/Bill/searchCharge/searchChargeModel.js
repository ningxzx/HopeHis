/**
 * Created by insomniahl on 15/11/23.
 * 查询结算
 */
define(["jquery", "backbone", "jctLibs"], function ($, Backbone, jctLibs) {
    var urlRoot = "http://114.55.85.57:8081";
    var searchChargeModel = Backbone.Model.extend({
        getCharge: function (data, state) {
            var that = this, result = {};
            data.enterprise_id = sessionStorage.getItem('enterprise_id');
            data.state = state || 'wjs,yjs,ytf';
            $.ajax({
                url: urlRoot + "/jethis/Charging/MainRecord",
                type: "get",
                data: data
            }).done(function (response) {
                if (response) {
                    result = {
                        errorNo: 0,
                        data: response
                    };
                }
                that.trigger("searchRecord", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("searchRecord", result);
            });
        },
        getDetail: function (recordId) {
            var that = this, result = {};
            $.ajax({
                url: urlRoot + "/jethis/Charging/DetailRecord",
                type: "get",
                data: {chargeRecordID: recordId}
            }).done(function (response) {
                result = {
                    errorNo: 0,
                    rows: response
                };
                that.trigger("getDetail", result);
            }).fail(function (error) {
                result = {
                    errorNo: -1,
                    errorInfo: error
                };
                that.trigger("getDetail", result);
            });
        }
    });

    return searchChargeModel;
});
