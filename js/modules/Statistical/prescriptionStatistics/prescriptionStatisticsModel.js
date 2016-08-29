/**
 * Created by insomniahl on 16/6/12.
 */
define(["jquery","backbone"], function ($,Backbone) {
    var urlRoot = "http://114.55.85.57:8081";
    var prescriptionStatisticsModel = Backbone.Model.extend({
        getDoctorInfo: function (data) {
            var that = this;
            var result = {
                errorNo: 0,//0为正确的值，其余值为错误
                rows: "",
                errorInfo: ""
            };
            $.ajax({
                type: "get",
                url: urlRoot + "/jethis/Statistics/PresStat",
                data: $.param({
                    account_id: data.doc_id,
                    department_name: data.depart,
                    start_date_time: data.start,
                    end_date_time: data.end
                })
            }).done(function (res) {
                result.errorNo = 0;
                result.data = res;
                that.trigger("doctorResult", result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                that.trigger("doctorResult", result);
            })
        },
    });
    return prescriptionStatisticsModel;
});