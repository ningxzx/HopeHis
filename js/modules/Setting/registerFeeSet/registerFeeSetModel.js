define(['jquery', "backbone",'jctLibs'], function ($, Backbone,jctLibs) {
    var registerFeeSetModel = Backbone.Model.extend({
        //保存费用
        saveFee: function (data) {
            var that = this,param=data||{};
            param['enterprise_id']= sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "post",
                url: "http://114.55.85.57:8081/jethis/setting/standardRegfeeSet",
                data: JSON.stringify(param)
            }).done(function (res) {
                var result = {};
                result.errorNo = 0;
                result.status=res.tip;
                that.trigger("changeLevel", result);

            }).fail(function (error) {
                var result = {};
                result.data = error;
                result.errorNo = -1;
                that.trigger("changeLevel", result);
            });
        },
        //修改单个医生的费用
        changeSingleRegfee: function (enp_id,accout_id,fee) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "post",
                url: 'http://114.55.85.57:8081/jethis/setting/doctorInfoSet',
                data: JSON.stringify({
                    'login_account_id':accout_id,
                    "enterprise_id": enp_id,
                    'register_fee':fee
                })
            }).done(function (data) {
                result.errorNo=0;
                result.status=data.tip;
                that.trigger("changeSingleFee", result);
            }).fail(function (error) {
                result.data = "错误状态:"+error.readyState + ",错误原因:" +error.responseText;
                result.errorNo = -1;
                that.trigger("changeSingleFee", result);
            });
        },
        getLevelfee: function () {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: 'http://114.55.85.57:8081/jethis/setting/standardRegfeeSet',
                data: {enterprise_id:sessionStorage.getItem('enterprise_id')}
            }).done(function (data) {
                result.errorNo=0;
                result.rows=jctLibs.listToObject(data,'rows')['rows'];
                that.trigger("getLevelFee", result);
            }).fail(function (error) {
                result.data = "错误状态:"+error.readyState + ",错误原因:" +error.responseText;
                result.errorNo = -1;
                that.trigger("getLevelFee", result);
            });
        }

    });
    return registerFeeSetModel;
});
