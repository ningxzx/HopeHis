/**
 * Created by xzx on 2016/5/5.
 */
define(['jquery', "backbone", 'jctLibs'], function ($, Backbone, jctLibs) {
    // 获取诊疗项目
    var treatmentModel = Backbone.Model.extend({
        geCureProject: function (params) {
            var _this = this, result = {};
            var param = params || {};
            param.json = JSON.stringify({'enterprise_id': sessionStorage.getItem('enterprise_id'),'is_delete':false});
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/query/get",
                type: 'get',
                data: param
            }).done(function (res) {
                result.errorNo = 0;
                result.data = jctLibs.listToObject(res, 'rows')['rows'];
                _this.trigger("treatmentGetted", result);
            }).fail(function (err) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                _this.trigger("treatmentGetted", result);
            })
        },
        getMedicines: function (type, page, evName, drug_name) {
            var _this = this, result = {};
            var param = {};
            param['goods_type'] = type;
            param['enterprise_id'] = sessionStorage.getItem('enterprise_id');
            if (drug_name) {
                param['goods_name'] = drug_name;
            }
            param['page'] = page || 1;
            param['row_num'] = 7;
            $.ajax({
                url: "http://192.168.0.220:8081/jethis/diagnosis/queryDrug",
                type: 'get',
                data: param
            }).done(function (res) {
                result.errorNo = 0;
                result.data = {rows: jctLibs.listToObject(res, 'rows')['rows'], dataNum: res.dataNum};
                _this.trigger(evName, result);
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                _this.trigger(evName, result);
            })
        },
        saveCheck: function (info, data, type) {
            var _this = this, result = {}, sendData, url = "",
                urlRoot = "http://192.168.0.220:8081",
                basicInfo = {
                    "req_hosp_id": info.hop_id,//申请医院ID
                    "req_hosp_name": info.hop_name,//申请医院名称
                    "register_no": info.register_id,//挂号id
                    "patient_id": info.patient_id,//患者ID
                    "patient_name": info.patient_name,//患者姓名
                    "patient_sex": info.patient_sex,//患者性别
                    "patient_birth": info.patient_birth,//患者出生日期
                    "marriage": info.marriage,//患者婚姻状况
                    "req_doctor": info.doctor,//申请医生
                    "req_doctor_name": info.doctor_name,//申请医生名称
                    "req_department": info.department_id,//申请科室
                    "req_department_name": info.department_name,//申请科室名称
                    "total_costs": info.total_costs//体格检查应收总费用
                };
            //检验
            if (type == "inspect") {
                url = urlRoot + "/jethis/diagnosis/inspection";
                sendData = JSON.stringify({
                    "inspection_record": basicInfo,
                    "inspection_detail_record": data
                });
                //诊疗
            } else if (type == "cureProject") {
                url = urlRoot + "/jethis/diagnosis/treatment";
                sendData = JSON.stringify({
                    "mainRecord": basicInfo,
                    "itemList": data
                });
                //检查
            } else if (type == "check") {
                url = urlRoot + "/jethis/diagnosis/check";
                sendData = JSON.stringify({
                    "check_record": basicInfo,
                    "check_detail_record": data
                });
            }
            $.ajax({
                url: url,
                type: 'post',
                data: sendData
            }).done(function (res) {
                if (res.resultCode == "100") {
                    result.errorNo = 0;
                    _this.trigger("saveTreat", result);
                }
            }).fail(function (err, response) {
                var responseText = $.parseJSON(err.responseText);
                result.errorNo = responseText.code;
                result.responseData = responseText.message;
                _this.trigger("saveTreat", result);
            });
        },
//////// 药物明细
        getDetail: function (data) {
            var that = this;
            var result = {};
            $.ajax({
                type: "get",
                url:"http://192.168.0.220:8081/jethis/DrugInfo/DrugInstructions",
                data: $.param(data)
            }).done(function (res) {
                result.errorNo = 0;
                result.rows=[];
                if(res.rows) {
                    result.rows = jctLibs.listToObject(res, 'rows')['rows'];
                }
                that.trigger("getDetail", result);
            }).fail(function (error) {
                result.data = error;
                result.errorNo = -1;
                that.trigger("getDetail", result);
            });
        }

    });


    return treatmentModel;

});