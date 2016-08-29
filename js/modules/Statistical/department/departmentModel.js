define(["jquery", "backbone","jctLibs"],function($, Backbone,jctLibs) {
    var rootUrl = "http://114.55.85.57:8081";
    var departmentModel = Backbone.Model.extend({
        getDepts: function (enterprise_id) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: rootUrl+"/jethis/department/all",
                reset: true,
                data: {epid: enterprise_id}
            }).done(function (res) {
                if(!!res.rows) {
                    result.errorNo = 0;
                    result.depts = jctLibs.listToObject(res, 'rows')['rows'];
                    that.trigger("deptsGetted", result);
                } else {
                    result.errorNo = 1;
                    that.trigger("deptsGetted", result);
                }

            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("deptsGetted", result);

            })
        },
    });
    return departmentModel;
})