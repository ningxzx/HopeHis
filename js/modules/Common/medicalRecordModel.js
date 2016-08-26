/**
 * Created by insomniahl on 15/12/18.
 */
define(["backbone"],function(Backbone) {
    // 病历表Model
    var medicalRecordModel = Backbone.Model.extend({
        defaults: {
            medical_record_no:"",//病例编号
            enterprise_id:"",//机构ID
            enterprise_name:"",//机构全称
            enterprise_code:"",//机构拼音码
            doctor_id:"",//医生ID
            doctor_name:"",//医生全名
            doctor_code:"",//医生拼音码
            patient_id:"",//患者ID
            patient_name:"",//患者全名
            patient_code:"",//患者拼音码
            patient_tell:"",//患者主诉
            diagnosis_id:"",//当日就诊记录ID
            exam_record_id:"",//体格检查ID
            check_id:"",//检查ID
            inspection_id:"",//检验ID
            diagnosis_result:"",//诊断结果
            doctor_advice:"",//医嘱
            prescription_id:"",//处方ID
            treatment_item_id:"",//诊疗项目ID
            infusion_id:"",//输液ID
            fee:""//费用
        },
        url:"http://URL/medical_records",

        //通过id查询历史记录
        getPatientById: function (enter_id, patient_id) {
            var that = this, result = new jctLibs.jetHisResult;
            this.url="http://www.baidu.coms";
            this.fetch({
                data: $.param({
                    //参数
                    enterprise_id: enter_id,
                    patient_id: patient_id
                }),
                success: function(model, response){
                    patientModel=model;
                    console.log(model);
                    result={
                        errorNo :0,
                        //TODO:根据返回值来输入obj
                        resData:jctLibs.listToObject(response[obj], "data")["data"],
                        errorInfo:""
                    };
                    that.trigger("patientInfoResult", result);
                },
                error: function (err, response) {
                    result={
                        errorNo:-1,
                        resData:response,
                        errorInfo:"获取患者分组失败"+err
                    };
                    that.trigger("patientInfoResult", result);
                }
            })
        },

        //通过id删除分组里的患者
        removePatientById: function (patient_id) {
            var that = this, result = new jctLibs.jetHisResult;
            this.url="http://www.baidu.coms";
            this.fetch({
                data: $.param({
                    //参数
                    enterprise_id: enter_id,
                    patient_id: patient_id
                }),
                success: function(model, response){
                    patientModel=model;
                    console.log(model);
                    result={
                        errorNo :0,
                        //TODO:根据返回值来输入obj
                        resData:jctLibs.listToObject(response[obj], "data")["data"],
                        errorInfo:""
                    };
                    that.trigger("removePatientResult", result);
                },
                error: function (err, response) {
                    result={
                        errorNo:-1,
                        resData:response,
                        errorInfo:"获取患者分组失败"+err
                    };
                    that.trigger("removePatientResult", result);
                }
            })
        }

    });

    return medicalRecordModel;

});
