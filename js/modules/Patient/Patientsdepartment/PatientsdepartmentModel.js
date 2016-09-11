define(['jquery', "backbone", 'jctLibs'],function($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.220:8081";
    // 会员Model，包含会员的基本信息
    var PatientsdepartmentModel = Backbone.Model.extend({
        getrater: function (data) {
            var that = this;
            var result = {};
            var params={

            };

            $.ajax({
                type: "post",
                url: rootUrl + "/JetHis/Patch/patient",
                //data:  JSON.stringify(params)
            }).done(function (data) {
                result.errorNo = 0;
                //result.rows = jctLibs.listToObject(data, 'rows')['rows'];
                result.rows=data;
                that.trigger("getrater", result);

            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getrater", result);
            });
        },

    });

    return PatientsdepartmentModel;

});


