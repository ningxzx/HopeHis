/**
 * Created by xzx on 2016/5/3.
 */
define(["jquery", "backbone"],
    function ($, Backbone) {
        var rootUrl = "http://114.55.85.57:8081";
        var mWarningModel = Backbone.Model.extend({
            getDrugmwarning: function (startdatetime, enddatetime,
                                       goodsname, goodstype, storatebatchno,
                                       suppliersname, productername, stockSt, stockEd) {
                var that = this;
                var result = {};
                var params = {
                    start_date_time: startdatetime,
                    end_date_time: enddatetime,
                    goods_name: goodsname,
                    goods_type: goodstype,
                    batch_no: storatebatchno,
                    suppliers_name: suppliersname,
                    producter_name: productername,
                    min_num: stockSt,
                    max_num: stockEd
                };
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/drugAlert/drugNumInfo",
                    data: params
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getDrugmwarning", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getDrugmwarning", result);
                });
            },
            minStorageBad: function (data) {
                var that = this;
                var result = {};
                var params = {
                    batch_no: data.batch_no,
                    goods_id: data.goods_id,
                    current_num: data.current_num,
                    id:data.id
                };
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/Drug/DrugLoss",
                    data: JSON.stringify(params)
                }).done(function (res) {
                    if(res['RESULT'] == "OK") {
                        result.errorNo = "0";
                        that.trigger("minStorageResult", result);
                    }
                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("minStorageResult", result);
                });
            },
            postSetting: function (data) {
                var that = this;
                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: ""
                };
                $.ajax({
                    type: "post",
                    url: rootUrl + "/jethis/FunctionSetting",
                    reset: true,
                    data: JSON.stringify(data),
                    success: function (res) {
                        result.errorNo = 0;
                        result.status=res['RESULT']
                        that.trigger("fsPost", result);
                    }
                })
            },
            getSetting: function (data) {
                var that = this;
                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: ""
                };
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/FunSettingResult",
                    reset: true,
                    data: JSON.stringify(data),
                    success: function (res) {
                        result.errorNo = 0;
                        result.setting=res['setting_result'];
                        that.trigger("getSetting", result);
                    }
                })
            },
        });
        return mWarningModel;
    });
