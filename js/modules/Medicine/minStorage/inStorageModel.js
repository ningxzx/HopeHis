define(["jquery", "backbone"],
    function ($, Backbone) {
        //入库人员提交审核后的入库记录 model,与数据库 入库表 对应.
        var rootUrl = "http://192.168.0.220:8081";
        var inStorageModel = Backbone.Model.extend({
            //获取收货人
            getRecopient: function () {
                var that = this;
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/customer/baseInfo",
                    data: {
                        "enterprise_id": sessionStorage.getItem('enterprise_id')
                    }
                }).done(function (data) {
                    var result = {};
                    if (data) {
                        result.errorNo = 0;
                        result.rows = data;
                        that.trigger("getResult", result);
                    }
                }).fail(function (error) {
                    var result = {};
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getResult", result);
                });
            },
            //获取已入库
            searchMedicine0: function (name) {
                var that = this;
                var data={};
                if(name){
                    data['chinese_name']=name;
                }
                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: ""
                };
                $.ajax({
                    type: "get",
                    data:data,
                    url:rootUrl+'/jethis/drug/drugBaseInfo/10',//10代表已有，20未有
                }).done(function (res) {
                    result.errorNo = 0;
                    result.rows = res.dataList;
                    that.trigger('getMedicine0', result);

                }).fail(function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger('getMedicine0', result);

                })
            },
            //未入库药品
            searchMedicine1: function (page,row_num,name) {
                var that = this;
                var param={page:page,row_num:row_num};
                if(name){
                    param['chinese_name']=name;
                }
                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: ""
                };
                $.ajax({
                    type: "get",
                    url:rootUrl+'/jethis/drug/drugBaseInfo/20',//10代表已有，20未有
                    data:param
                }).done(function (res) {
                    result.errorNo = 0;
                    result.data={};
                    result.data.rows = res.dataList;
                    result.data.dataNum = res.dataNum;
                    that.trigger('getMedicine1', result);

                }).fail(function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger('getMedicine1', result);

                })
            },
            //未入库药品
            searchMedicineByGun: function (code) {
                var that = this;
                var param={page:1,row_num:10};
                if(code){
                    param['drug_code']=code;
                }
                var result = {
                    errorNo: 0,//0为正确的值，其余值为错误
                    errorInfo: ""
                };
                $.ajax({
                    type: "get",
                    url:rootUrl+'/jethis/drug/drugBaseInfo/20',//10代表已有，20未有
                    data:param
                }).done(function (res) {
                    result.errorNo = 0;
                    result.rows = res.dataList;
                    that.trigger('getGunCode', result);

                }).fail(function (err, response) {
                    var responseText = $.parseJSON(err.responseText);
                    result.errorNo = responseText.code;
                    result.responseData = responseText.message;
                    that.trigger('getGunCode', result);
                })
            },
            //提交审核
            submitInfo: function (data) {
                var that = this;
                $.ajax({
                    type: "post",
                    url: rootUrl+'/jethis/storate/newStorateRecord',
                    data: JSON.stringify(data)
                }).done(function (data) {
                    var result = {};
                    if (data.state == "100") {
                        result.errorNo = 0;
                        that.trigger("saveResult", result);
                    }
                    else{
                        result.errorNo = data.state;
                        that.trigger("saveResult", result);
                    }
                }).fail(function (error) {
                    var result = {};
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("saveResult", result);
                });
            },
            getOwnCheckRecord: function (data) {
                var that = this;
                var result = {};
                var params=data||{};
                params['enterprise_id']=sessionStorage.getItem('enterprise_id');
                params['account_id']=sessionStorage.getItem('account_id');
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/storate/storateRecordInfo",
                    data: params
                }).done(function (rows) {
                    result.errorNo = 0;
                    result.rows = rows;
                    that.trigger("getOwnCheckRecord", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getOwnCheckRecord", result);
                });
            },
        });
        return inStorageModel;
    });
