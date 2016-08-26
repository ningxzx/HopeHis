define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var rootUrl = "http://192.168.0.116:8081";
    // 获取患者信息项目
    var regPatsModel = Backbone.Model.extend({
        getRegPatients: function (state) {
            //0:已结束就诊,1:挂单,2:现诊中,3:未就诊
            var _this = this, result = {};
            var  param = {"doctor_id": sessionStorage.getItem('doctor_id'),state:state};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Patient/PatientInfo",
                type: 'get',
                data:param
            }).done(function (res) {
                result.errorNo = 0;
                result.data = res;
                if (state == "1,2,3") {
                    _this.trigger("waitPatientsGetted", result);
                } else if (state == 0) {
                    _this.trigger("curePatientsGetted", result);
                }
            }).fail(function (err, response) {
                result.errorNo = -1;
                result.status = err.status;
                result.responseData = err.statusText;
                if (state == "1,2,3") {
                    _this.trigger("waitPatientsGetted", result);
                } else if (state == 0) {
                    _this.trigger("curePatientsGetted", result);
                }
            })
        },
        startPatient: function (data) {
            var _this = this, result = {};
            $.ajax({
                url: rootUrl + "/jethis/diagnosis/start",
                type: 'post',
                data: JSON.stringify(data||{})
            }).done(function (res) {
                if (!!res) {
                    result.errorNo = 0;
                    result.diagData = res;
                    result.index = data.row_index;
                    _this.trigger("startDiagnose", result);
                } else {
                    result.errorNo = 1;
                    _this.trigger("startDiagnose", result);
                }
            }).fail(function (err, response) {
                result.errorNo = -1;
                _this.trigger("startDiagnose", result);
            })
        },
        regist: function (enter_id, pat_id, doc_id, acc_id,deptId,deptName) {
            var that = this;
            var result = {
                errorNo: 0,
                msg: ""
            };
            this.url = "http://192.168.0.220:8081/jethis/registeration/patientregisteration";
            this.save({
                enterprise_id: enter_id,
                patient_id: pat_id,
                doctor_id: doc_id,
                account_id: acc_id,
                department_id:deptId,
                department_name:deptName
            }, {
                success: function (model, response) {
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
                error: function (err, response) {
                    result = {
                        error: -1,
                        msg: response
                    };
                    that.trigger("regist_result", result);
                }
            });
        }
    });
    return regPatsModel;

});