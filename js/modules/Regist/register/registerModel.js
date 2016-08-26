/**
 * Created by insomniahl on 15/11/24.
 */
define(['jquery',"backbone","jctLibs"], function ($,Backbone,jctLibs) {
    var registerModel = Backbone.Model.extend({
        //挂号并收费
        regist: function (enter_id, pat_id, doc_id, acc_id,deptId,deptName,fee) {
            var that = this;
            var result = {
                errorNo: 0,
                msg: ""
            };
            $.ajax({
                type:'post',
                url:'http://192.168.0.220:8081/jethis/registeration/patientregisteration',
                data: JSON.stringify({
                    enterprise_id: enter_id,
                    patient_id: pat_id,
                    doctor_id: doc_id,
                    account_id: acc_id,
                    department_id: deptId,
                    department_name: deptName,
                    register_fee:fee
                }),
                success: function ( response) {
                    if (response.register_id == "-1") {
                        result = {
                            errorNo: -1,
                            msg: "挂号失败"
                        };
                    } else {
                        result = {
                            errorNo: 0,
                            msg: "挂号成功",
                            obj: response
                        };
                    }
                    that.trigger("regist_result", result);
                },
                error: function ( response) {
                    result = {
                        error: -1,
                        msg: response
                    };
                    that.trigger("regist_result", result);
                }
            });
        },
        getDoctor: function (date) {
            var that = this;
            var result = {
                errorNo: 0,
                obj: {}
            };
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/registeration/get_registeration_data",
                data: $.param({
                    enterprise_id: sessionStorage.getItem('enterprise_id'),
                    start_date: date
                })
            }).done(function (res) {
                result.errorNo = 0;
                result.doctors= res;
                that.trigger("getDoctorResult", result);
            }).fail(function (err, response) {
                result.errorNo = -1;
                result.msg = "获取医生列表失败";
                that.trigger("getDoctorResult", result);
            });
        },

    });

    return registerModel;
});
