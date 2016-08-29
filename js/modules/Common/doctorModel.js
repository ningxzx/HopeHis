define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    // 医生Model
    var doctorModel = Backbone.Model.extend({
        //查询当天所有上班的医生
        getDoctor: function (date) {
            var that = this;
            var result = {
                errorNo: 0,
                obj: {}
            };
            $.ajax({
                url: "http://114.55.85.57:8081/jethis/registeration/get_registeration_data",
                data: $.param({
                    enterprise_id: sessionStorage.getItem('enterprise_id'),
                    start_date: date,
                    end_date: date
                })
            }).done(function (res) {
                result.errorNo = 0;
                result.doctors= jctLibs.listToObject(res, 'rows')['rows'];
                that.trigger("getDoctorResult", result);
            }).fail(function (err, response) {
                result.errorNo = -1;
                result.msg = "获取医生列表失败";
                that.trigger("getDoctorResult", result);
            });
        },

        //获取当天科室的医生
        getDeptDoctor: function (enter_id, dept_id, date) {
            var that = this;
            var result = {
                errorNo: -1,
                msg: "",
                obj: {}
            };
            this.url = "http://114.55.85.57:8081/jethis/registeration/get_registeration_data";
            this.fetch({
                data: $.param({
                    enterprise_id: enter_id,
                    department_id: dept_id,
                    start_date: date,
                    end_date: date
                }),
                success: function (model, response) {
                    var data = response.doctor_work.data;
                    if (data.length != 0) {
                        result = {
                            errorNo: 0,
                            msg: "",
                            obj: response.doctor_work
                        };
                    } else if (data.length == 0) {
                        result = {
                            errorNo: 1,
                            msg: "今日无医生值班"
                        };
                    }
                    that.trigger("getDeptDoctorResult", result);
                },
                error: function (err, response) {
                    result = {
                        errorNo: -1,
                        msg: "获取医生列表失败"
                    };
                    that.trigger("getDeptDoctorResult", result);
                }
            });
        }
    });

    return doctorModel;

});