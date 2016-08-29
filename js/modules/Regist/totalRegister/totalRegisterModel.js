/**
 * Created by insomniahl on 16/5/5.
 */
define(["jquery", "backbone"], function ($, Backbone) {
    var rootUrl = "http://114.55.85.57:8081";
    var model = Backbone.Model.extend({

//科室
        getDepartment: function (starttime,endtime) {
            var that = this;
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/registeration/statisticsbydepartment",
                data: {
                    enterprise_id:sessionStorage.getItem('enterprise_id'),
                    start_time:starttime,
                    end_time:endtime
                }
            }).done(function (data) {
                var result = {};

                    result.errorNo = 0;
                    result.data = data;
                    that.trigger("getDepartment", result);

            }).fail(function (error) {
                var result = {};
                result.data = error;
                result.errorNo = -1;
                that.trigger("getDepartment", result);
            });
        },
//医生

        getdoctotal: function (departmentid,starttime,endtime) {
            var that = this;
            $.ajax({
                type: "get",
                url: rootUrl + "/jethis/registeration/statisticsbydoctor",
                data: {
                    enterprise_id:sessionStorage.getItem('enterprise_id'),
                    department_id:departmentid,
                    //doctor_id:sessionStorage.getItem('doctor_id'),
                    start_time:starttime,
                    end_time:endtime
                }
            }).done(function (data) {
                var result = {};
                result.errorNo = 0;
                result.data = data;
                that.trigger("getdoctotal", result);

            }).fail(function (error) {
                var result = {};
                result.data = error;
                result.errorNo = -1;
                that.trigger("getdoctotal", result);
            });
        },
    });

    return model;
});
