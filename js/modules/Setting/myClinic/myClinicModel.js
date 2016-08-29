define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    // 会员Model，包含会员的基本信息
    var myClinicModel = Backbone.Model.extend({
        //消费统计
        getclinicre: function (data) {
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
                result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                that.trigger("getclinicre", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getclinicre", result);
            });
        },


    });


    return myClinicModel;

});


