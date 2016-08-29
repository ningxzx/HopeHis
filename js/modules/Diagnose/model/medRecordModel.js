define(["backbone", "jctLibs"], function (Backbone, jctLibs) {
    // 病历Model，包含
    var medRecordModel = Backbone.Model.extend({
        defaults: {
            "infusion_no": "",//输液单号
            "register_id": "",//挂号编号
            "fee": "",//病历总费用
            "doctor_advice": "",//医嘱
            "diagnosis_result": "",//诊断结果
            "enterprise_id": "",//机构ID
            "enterprise_name": "",//机构名称
            "doctor_id": "",//医生ID
            "doctor_name": "",//医生姓名
            "patient_id": "",//患者ID
            "patient_name": "",//患者姓名
            "exam_no": "", //检查单号
            "patient_tell":""//患者主诉
        },
        url:"http://114.55.85.57:8081/jetHis/Prescription_add"
    });
    return medRecordModel;
})
