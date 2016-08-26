/**
 * Created by xzx on 2016/5/12.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    var diagnoseModel = Backbone.Model.extend({
        /**
         * 完成就诊
         * @param data
         */
        stopDiag: function (data) {
            var _this = this, result = {};
            var param = JSON.stringify({
                "enterprise_id": data.enterprise_id,
                "enterprise_name": data.enterprise_name,
                "register_no": data.register_no,
                "patient_id": data.patient_id,
                "patient_name": data.patient_name,
                "doctor_id": data.doctor_id,
                "doctor_name": data.doctor_name,
                "patient_tell": data.patient_tell || "",
                "diagnosis_result": data.diagnosis_result || "",
                "doctor_advice": data.doctor_advice || "",
                "diagnosis_id": data.diagnosis_id,
                "state": "1"
            });
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/diagnosis/stop",
                type: 'patch',
                data: param
            }).done(function (res) {
                if (res.result == "OK") {
                    result.errorNo = 0;
                    _this.trigger("stopDiagnose", result);
                } else if (res.tip == "-1") {
                    result.errorNo = -1;
                    result.info = "该患者挂单失败，请重新挂单";
                    _this.trigger("stopDiagnose", result);
                }
            }).fail(function (error) {
                result.errorNo = 1;
                result.data = error;
                _this.trigger("stopDiagnose", result);
            })
        },
        finishDiag: function (data) {
            var _this = this, result = {};
            var param = JSON.stringify({
                "diagnosis_record": {
                    "patient_tell": data.patient_tell,
                    "doctor_advice": data.doctor_advice,
                    "diagnosis_result": data.diagnosis_result,
                    "register_no": data.register_no,
                    "diagnosis_id": data.diagnosis_id
                },
                "ZY": {
                    "prescription": {
                        "hospital_id": data.enterprise_id,
                        "hospital_name": data.enterprise_name,
                        "patient_id": data.patient_id,
                        "patient_name": data.patient_name,
                        "patient_sex": data.patient_sex,
                        "patient_birth": data.patient_birth,
                        "marriage": data.patient_marriage,
                        "doctor_id": data.doctor_id,
                        "doctor_name": data.doctor_name,
                        "total_costs": data.zy_cost
                    },
                    "prescription_drug_detail": data.zy
                },
                "XY": {
                    "prescription": {
                        "hospital_id": data.enterprise_id,
                        "hospital_name": data.enterprise_name,
                        "patient_id": data.patient_id,
                        "patient_name": data.patient_name,
                        "patient_sex": data.patient_sex,
                        "patient_birth": data.patient_birth,
                        "marriage": data.patient_marriage,
                        "doctor_id": data.doctor_id,
                        "doctor_name": data.doctor_name,
                        "total_costs": data.xy_cost
                    },
                    "prescription_drug_detail": data.xy
                }
            });
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/Diagnosis/UpdateResult/0",
                type: 'PATCH',
                data: param
            }).done(function (res) {
                if (res.resultCode == "100") {
                    result.errorNo = 0;
                    result.data = res;
                    _this.trigger("finishDiagnose", result);
                } else {
                    result.errorNo = -1;
                    result.info = "该患者已经就诊完成，请选择下一位患者";
                    _this.trigger("finishDiagnose", result);
                }
            }).fail(function (error) {
                result.errorNo = 1;
                result.data = error;
                _this.trigger("finishDiagnose", result);
            })
        },
        getHis: function (patient_id, patient_name, type) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/query/get",
                type: 'get',
                data: $.param({
                    "table": "diagnosis.patient_history",
                    "json": JSON.stringify({
                        "patient_id": patient_id,
                        "patient_name": patient_name,
                        "type": type
                    })
                })
            }).done(function (res) {
                if (res.rows) {
                    result.errorNo = 0;
                    var data = jctLibs.listToObject(res, "rows")["rows"];
                    result.data = data[0].detail;
                    result.type = type;
                    result.record_id = data[0].record_id;
                    _this.trigger("getHisResult", result);
                }
            }).fail(function (error) {
                result.errorNo = 1;
                result.data = error;
                result.type = type;
                _this.trigger("getHisResult", result);
            })
        },
        saveHis: function (pat_id, pat_name, record, detail, type) {
            var _this = this, result = {};
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/patient/NewPatientHistory",
                type: 'post',
                data: JSON.stringify({
                    "patient_id": pat_id,
                    "patient_name": pat_name,
                    "detail": detail,
                    "type": type,
                    "record_id": record
                })
            }).done(function (res) {
                if (res.state == "100") {
                    result.errorNo = 0;
                    result.data = res;
                    result.type = type;
                    _this.trigger("saveHisResult", result);
                }
            }).fail(function (error) {
                result.errorNo = 1;
                result.data = error;
                _this.trigger("saveHisResult", result);
            })
        },
        postBodyCheck: function (pat_id, diagnosis_id, register_no, param) {
            var _this = this, result = {};
            $.ajax({
                type: 'post',
                url: "http://192.168.0.116:8081/jethis/Diagnosis/NewPhyExam",
                data: JSON.stringify({
                    "patient_id": pat_id,
                    "diagnosis_id": diagnosis_id,
                    "register_no": register_no,
                    "result": param
                }),
                success: function (res) {
                    if (res.resultCode == "100") {
                        result.errorNo = 0;
                        _this.trigger("postBodyCheck", result);
                    }
                }
            });
        },
        getBodyCheck: function (pat_id, diagnosis_id, register_no) {
            var _this = this, result = {};
            $.ajax({
                type: 'get',
                url: "http://192.168.0.116:8081/jethis/Diagnosis/NewPhyExam",
                data: $.param({
                    "patient_id": pat_id, "diagnosis_id": diagnosis_id, "register_no": register_no
                }),
                success: function (res) {
                    result.errorNo = 0;
                    result.checkData=res;
                    _this.trigger("getBodyCheck", result);

                }
            });
        },


    });
    return diagnoseModel;

});