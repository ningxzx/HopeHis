define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    // 会员Model，包含会员的基本信息
    var memberStatisticsModel = Backbone.Model.extend({
        //消费统计
        getconsumption: function (data) {
            var that = this;
            var result = {};
            var params=data||{};
            params['enterprise_id']=sessionStorage.getItem('enterprise_id');
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/members/getcsmrecord",
                data: params
            }).done(function (data) {
                result.errorNo = 0;

                if(data.rows){
                    result.rows = data.rows ? jctLibs.listToObject(data, 'rows')['rows'] : [];
                }else{
                    result.depts=data;
                }
                that.trigger("getconsumption", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getconsumption", result);
            });
        },

        //积分兑换
            getexchange: function (data) {
                var that = this;
                var result = {};
                var params=data||{};
                params['enterprise_id']=sessionStorage.getItem('enterprise_id');
                $.ajax({
                    type: "get",
                    url: rootUrl + "/jethis/members/getchangerecord",
                    data: params
                }).done(function (data) {
                    result.errorNo = 0;
                    result.rows = data.rows ? jctLibs.listToObject(data, 'rows')['rows'] : [];
                    that.trigger("getexchange", result);

                }).fail(function (error) {
                    result.data = error;
                    result.errorNo = -1;
                    that.trigger("getexchange", result);
                });
            },

    });


    return memberStatisticsModel;

});


